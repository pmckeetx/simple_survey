var express = require( 'express' );
var models = require( '../models' );
var util = require( 'util' );
var _ = require( 'underscore' );
var q = require( 'q' );

var router = express.Router();

//
//  H E L P E R   F U N C T I O N S
//====================================================================

//
//  Get a list of question ids that the ip address is associated with
//
function getQuestionIdsGuestHasSeen( ipaddress ) {
    var defered = q.defer();

    models.SurveyAnswer.findAll({ 
        where: { guestIP: ipaddress }
    }).then( function( surveyAnswers ) {
        var ids = _.pluck( surveyAnswers, 'QuestionId' );
        defered.resolve( ids );

    }).catch( function( error ) {
        defered.reject( error );
    });

    return defered.promise;
}
//
//  Get a list of valid question ids from the database;
//
function getListOfValidQuestionIds( filterIds ) {
    var defered = q.defer();

    var filterIds = filterIds || [];

    models.Question.findAll().then(function( questions ) {
        var ids = _.pluck( questions, 'id' );
        var validIds = _.difference( ids, filterIds );

        defered.resolve( validIds );

    }).catch( function( error ) {
        defered.reject( error );
    });

    return defered.promise;
}
//
//  Pull a random id from the list provided
//
function randomlySelectQuestionId( ids ) {
    var randomIndex = _.random( 0, ids.length-1 );
    return ids[ randomIndex ];
}

//
//  ROUTE HANDLERS
//====================================================================
//
//  Main route to handle presenting the user a survey question
//
router.get( '/', function ( req, res, next ) {
    
    var ipaddress = req.ip;
    
    // Allow developer to mock IPs for testing.
    // ************************************** **************************************
    if( process.env.RANDOM_IP ) {
        ipaddress = process.env.RANDOM_IP;
    }
    // ************************************** **************************************
    
    //
    //  See if we have survey questions
    //
    models.Question.findAll().then(
        function( questions ) {
            if( questions.length === 0 ) {
                //
                //  No survey questions yet so redirect to the 
                //  setup page.
                //
                res.render( 'setup' );
            } else {

                q.fcall( function() { return ipaddress; } )
                //
                //  Get a list of question ids the guest ip has seen
                //
                .then( getQuestionIdsGuestHasSeen )
                //
                //  Filter out the question ids the guest has seen already
                //
                .then( getListOfValidQuestionIds )
                //
                //  Randomly pick a question out of the filtered ids
                //
                .then( randomlySelectQuestionId )
                //
                //  Present the question to the user
                //
                .then( function( questionId ) {
                    if( !questionId ) {
                        res.render( 'index', { question: null, errors: null } );
                    } else {
                        models.Question.find( { 
                            where: { id: questionId },
                            include: [{ model: models.Answer }] 
                        } ).then( function( question ) {
                            res.render( 'index', { question: question, errors: null } );
                        });
                    }
                });

            }
        }
    ).catch( function( error ) {
        res.render( 'error_general', { errors: [error] } );
    });

} );
//
//  Handle request when user refreshes after answering a question
//  Or navigates directly here
//
router.get( '/save', function( req, res, next ) {
    res.redirect( '/' );
});
//
//  Handle saving an answer to a survey question
//
router.post( '/save', function ( req, res, next ) {
    var questionId = req.body.questionId;
    var answerId = req.body.answer;
    var guestIP = req.ip;
    //
    // Allow developer to mock IPs for testing.
    // ************************************** **************************************
    if( process.env.RANDOM_IP ) {
        guestIP = process.env.RANDOM_IP;
    }
    // ************************************** **************************************

    if( !questionId || questionId.length === 0 ) {
        var err = new Error( 'Invalid question id.' );
        throw err;
        return;
    }

    if( !answerId || answerId.length === 0 ) {
        var errors = [
            { msg: 'Please choose an answer and try again.' }
        ];

        models.Question.find( { 
            where: { id: questionId },
            include: [{ model: models.Answer }] 
        } ).then( function( question ) {
            res.render( 'index', { question: question, errors: errors } );
        });
    } else {
        console.log( '*** Saving answer for: '+ guestIP );
        
        models.SurveyAnswer.create({
            guestIP: guestIP,
            QuestionId: questionId,
            AnswerId: answerId
        }).then( function( surveyAnswer ) {
            res.redirect( 'thankyou' );
        })
    }
} );
//
//  Render thank you page
//
router.get( '/thankyou', function( req, res, next ) {
    res.render( 'thankyou' );
});

module.exports = router;
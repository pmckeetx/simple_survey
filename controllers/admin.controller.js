var express = require( 'express' );
var models = require( '../models' );
var util = require( 'util' );

var router = express.Router();
//
//  List of questions
//
router.get( '/', function ( req, res, next ) {
    res.redirect( '/admin/questions' );
} );

router.get( '/questions', function( req, res, next ) {
    models.Question.findAll({
        include: [{
            model: models.Answer
        }]
    }).then(
        function( questions ) {
            questions.forEach( function( q ) {
                if( q.Answers && q.Answers.length ) {
                    q.Answers.forEach( function( a ) {
                        console.log( '  a: '+ a.answerText );
                    } );
                }
            })

            res.render( 'admin/questions', { questions: questions } );
        }
    );
} );
// //
// //  Question details
// //
// router.get( '/question/:question_id', function( req, res, next ) {
//     req.check( 'question_id', 'Invalid question id.' ).isInt();

//     var errors = req.validationErrors();
//     if ( errors ) {
//         res.render( 'error_404', { error: null } );
//         return;
//     } else {
//         models.Question.findById( req.params.question_id ).then( 
//             function( question ) {
//                 if( question ) {
//                     res.render( 'admin/question', { question: question } );
//                 } else {
//                     res.render( 'error_404', { error: null } );
//                 }
//             }
//         );
//     }

// } );
// //
// //  Return html page to create a question
// //
// router.get( '/question', function( req, res, next ) {
//     res.render( 'admin/question_create', { question: {}, errors: null } );
// } );




module.exports = router;
var express = require( 'express' );
var models = require( '../../models' );
var util = require( 'util' );
var sequelize = require( 'sequelize' );

var router = express.Router();

//
//  Create Question
//
router.post( '/question', function( req, res, next ) {

    req.check( 'questionText', 'Question is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
        res.json( { errors: errors } );
    } else {
        models.Question.create( { questionText: req.body.questionText } ).then( 
            function ( question ) {
                res.json( { question: question } );
            } 
        );    
    }

} );
//
//  Destroy Question
//
router.delete( '/question/:question_id', function( req, res, next ) {

    req.check( 'question_id', 'Question id is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
        res.json( { errors: errors } );
    } else {
        models.Question.destroy( { 
            where: {
                id: req.params.question_id
            }
        } ).then( function ( question ) {
            res.json( { questionId: req.params.question_id } );

        } ).catch( function( err ) {
            res.json( { error: err } );

        } );
    }

} );
//
//  Update Question
//
router.put( '/question/:question_id', function( req, res, next ) {

    req.check( 'question', 'Question is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
        res.json( { errors: errors } );
    } else {

        models.Question.update( 
            { questionText: req.body.question.questionText },
            { where: { id: req.params.question_id }}
        ).then( function ( questions ) {
            res.json( { questionId: req.params.question_id } );

        } ).catch( function( err ) {
            res.json( { error: err } );

        } );
    }

} );
//
//  Create Answer
//
router.post( '/question/:question_id/answer', function( req, res, next ) {

    req.check( 'answerText', 'An answer is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
        res.render( 'admin/question', { errors: errors, question: {} } );
    } else {
        var newAnswer = {
            QuestionId: req.params.question_id,
            answerText: req.body.answerText
        }
        models.Answer.create( newAnswer ).then( function ( answer ) {
            res.json( {'answer': answer } );
        } );    
    }
} );
//
//  Delete Answer
//
router.delete( '/question/:question_id/answer/:answer_id', function( req, res, next ) {

    req.check( 'answer_id', 'Question id is required.' ).notEmpty().isInt();

    var errors = req.validationErrors();
    if ( errors ) {
        res.json( { errors: errors } );
    } else {
        models.Answer.destroy( { 
            where: {
                id: req.params.answer_id
            }
        } ).then( function ( question ) {
            res.json( { answerId: req.params.answer_id } );

        } ).catch( function( err ) {
            res.json( { error: err } );

        } );
    }

} );
//
//  Stats by Question
//
router.get( '/question/:question_id/stats', function( req, res, next ) {
    models.SurveyAnswer.findAll({
        where: { 
            QuestionId: req.params.question_id,
            AnswerId: {
              $ne: null
            }
        },
        include: [{ model: models.Answer }],
        attributes: [ [sequelize.fn( 'count', sequelize.col('AnswerId') ), 'total'] ],
        group: ['AnswerId']
    }).then( function( results ) {
        res.json( { stats: results } );
    });

} );

module.exports = router;
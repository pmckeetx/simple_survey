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
            res.render( 'admin/questions', { questions: questions } );
        }
    );
} );

module.exports = router;
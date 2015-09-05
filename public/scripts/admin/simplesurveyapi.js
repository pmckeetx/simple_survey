(function( $, context ) {
    'use strict'

    var baseUrl = '/api/';
    var questionUrl = baseUrl +'question';

    var api = {
        createQuestion: function( question, fn ) {
            $.ajax( {
                type: "POST",
                url: questionUrl,
                data: {questionText: question},
                dataType: 'json',
                success: function( data ) {
                    fn( null, data.question );
                },
                error: function( err ) {
                    fn( err, null );
                }
            } );
        },
        deleteQuestion: function( questionId, fn ) {
            $.ajax( {
                type: "DELETE",
                url: questionUrl +'/'+ questionId,
                dataType: 'json',
                success: function( data ) {
                    if( data.error ) {
                        fn( data.error, null );    
                        return;
                    }

                    fn( null, data.questionId );
                },
                error: function( err ) {
                    fn( err, null );
                }
            } );  
        },
        updateQuestion: function( question, fn ) {
            $.ajax( {
                type: "PUT",
                url: questionUrl +'/'+ question.id,
                data: JSON.stringify( {question: question} ),
                dataType: 'json',
                contentType: "application/json",
                success: function( data ) {
                    if( data.errors ) {
                        fn( data.errors, null );    
                        return;
                    }
                    fn( null, data.questionId );
                },
                error: function( err ) {
                    fn( err, null );
                }
            } );
        },
        //
        //  Answers
        //
        createAnswerForQuestion: function( questionId, answerText, fn ) {
            $.ajax( {
                type: "POST",
                url: questionUrl +'/'+ questionId +'/answer',
                data: JSON.stringify( {answerText: answerText} ),
                dataType: 'json',
                contentType: "application/json",
                success: function( data ) {
                    if( data.errors ) {
                        fn( data.errors, null );    
                        return;
                    }
                    fn( null, data.answer );
                },
                error: function( err ) {
                    fn( err, null );
                }
            } );
        },
        deleteAnswerToQuestion: function( questionId, answerId, fn ) {
            $.ajax( {
                type: "DELETE",
                url: questionUrl +'/'+ questionId +'/answer/'+ answerId,
                dataType: 'json',
                success: function( data ) {
                    if( data.error ) {
                        fn( data.error, null );    
                        return;
                    }

                    fn( null, data.answerId );
                },
                error: function( err ) {
                    fn( err, null );
                }
            } ); 
        },
        //
        //  Stats
        //
        getAnswerStatsForQuestion: function( questionId, fn ) {
            $.ajax( {
                type: "GET",
                url: questionUrl +'/'+ questionId +'/stats',
                dataType: 'json',
                success: function( data ) {
                    fn( null, data.stats );
                },
                error: function( err ) {
                    fn( err, null );
                }
            } );
        }

    }

    window.simpleSurveyApi = api;


})( jQuery, window );
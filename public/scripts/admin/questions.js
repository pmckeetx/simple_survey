(function( $, context ) {
    'use strict'
    //
    //  Hash containing questions from the server.
    //  The 'question.id' is used as the hashkey.
    //
    var questionsHash = context.data;
    //
    //  API service
    //  Handles interaction with the server.
    //
    var api = context.simpleSurveyApi;

    //  R E N D E R E R S
    //========================================================================= 
    function renderQuestions() {
        var questionsHtml = '';

        Object.keys( questionsHash ).forEach( function( key ) {
            var question = data[key],
                html;

            question.id = key;

            html = templates.question( question );
            questionsHtml += html;
        });

        $('.question-list').html( questionsHtml );

        renderStats();
    }

    function renderError( err ) {
        var errhtml = templates.error( { error: { msg: err } } );
        $('#error-wrapper').append( errhtml );
    }

    function renderStats() {
        Object.keys( questionsHash ).forEach( function( key ) {
            api.getAnswerStatsForQuestion( key, function( err, stats ) {
                if( err ) {
                    console.log( 'error retreiving stats for question '+ key +': '+ err );
                    return;
                }

                var grandTotal = 0;
                stats.forEach( function( s ) {
                    grandTotal += s.total;
                });

                stats.forEach( function( s ) {
                    s.percent = Math.round( (s.total / grandTotal)*100 );
                });

                var data = {
                    answers: stats,
                    grandTotal: grandTotal
                }
                var html = templates.stats( data );
                $( '#stats-tbody-'+ key).html( html );
                
            } );
        });
    }
    
    //  E V E N T   H A N D L E R S
    //=========================================================================

    //
    //  Check that the 'enter' key was pressed and if so, call the provided
    //  function (fn)
    //
    function dispatchEnterKey( fn ){
        return function( event ) {
            if( event.which === 13 ) {
                fn( event );
            }
        }
    }
    //
    //  Creates a new Question when the user clicks the 'Create a question' button.
    //
    function addNewQuestionBtn_click( event ) {
        event.preventDefault();

        var newQuestionText = $( '#newQuestionText' ).val();
        if( newQuestionText && newQuestionText.length > 0 ) {
            
            api.createQuestion( newQuestionText, function( err, question ) {
                if( err ) {
                    renderError( err );
                    return;
                }

                question.display = true;
                questionsHash[ question.id ] = question

                renderQuestions();

                $( '#newQuestionText' ).val( '' );
            });

        } else {
            $('#newQuestionText').focus();
        }
    }
    //
    //  Updates the text of a question when the user clicks the 'Update' button.
    //
    function updatedQuestionText_click( event ) {
        event.preventDefault();

        var questionId = $( event.currentTarget ).data( 'questionId' );
        var question = questionsHash[ questionId ];

        var updatedQuestionText = $( '#questionText'+ questionId ).val();
        if( updatedQuestionText && updatedQuestionText.length > 0 ) {
            
            var originalQuestionText = question.questionText;

            question.questionText = updatedQuestionText;

            api.updateQuestion( question, function( err, updatedQuestion ) {
                if( err ) {
                    question.questionText = originalQuestionText;
                    renderError( err );
                }

                renderQuestions();
            });
        } else {
            $( '#questionText'+ questionId ).val( question.questionText ).focus();
        }
    }
    //
    //  Shows or hides a question's edit textbox.
    //
    function viewQuestionBtn_click( event ) {
        event.preventDefault();
        
        var questionId = $( this ).data( 'questionId' );

        toggleQuestionDetails( questionId );
    }
    function toggleQuestionDetails( questionId ) {
        $('#question-details-'+ questionId ).toggle();
        $('#triangle-right-'+ questionId ).toggle();
        $('#triangle-down-'+ questionId ).toggle();

        questionsHash[ questionId ].display = !questionsHash[ questionId ].display;
    }
    //
    //  Deletes a question from the system when a user clicks the Trash Can icon.
    //
    function deleteQuestionBtn_click( event ) {
        event.preventDefault();

        if( confirm( 'Are you sure you want to delete this question?' ) ) {
            var questionId = $( this ).data( 'questionId' );

            api.deleteQuestion( questionId, function( err, resultQuestionId ) {
                delete questionsHash[ resultQuestionId ];
                renderQuestions();
            } );
        }
    }
    //
    //  Shows or hides a questions details.
    //
    function viewUpdateQuestionBtn_click( event ) {
        event.preventDefault();

        var questionId = $( this ).data( 'questionId' );

        if( !questionsHash[ questionId ].display ) {
            toggleQuestionDetails( questionId );
        }

        $('#updateQuestionTextWrapper'+ questionId ).toggle();
    }
    //
    //  Handles creating a new answer option for a question when the user 
    //  clicks 'Create an answer'.
    //
    function addNewAnswerBtn_click( event ) {
        event.preventDefault();

        var questionId = $( event.currentTarget ).data( 'questionId' );

        var newAnswerText = $('#newAnswerText'+ questionId).val();
        if( newAnswerText && newAnswerText.length > 0 ) {

            api.createAnswerForQuestion( questionId, newAnswerText, function( err, data ) {
                if( err ) {
                    renderError( err );
                    return;
                }

                if( !questionsHash[ questionId ].answers ) {
                    questionsHash[ questionId ].answers = [];
                }

                questionsHash[ questionId ].answers.push( {
                    id: data.id, 
                    answerText: data.answerText
                });

                renderQuestions();

                $('#newAnswerText'+questionId).focus();
            } );

        } else {
            $( '#newAnswerText'+ questionId ).focus();
        }
    }
    //
    //  Deletes an answer from the system when a user clicks the 'X' icon next to an answer.
    //
    function deleteAnswer_click( event ) {
        event.preventDefault();

        if( confirm( 'Are you sure you want to delete this answer?' ) ) {
            var questionId = $( this ).data( 'questionId' );
            var answerTextId = $( this ).data( 'answerTextId' );

            api.deleteAnswerToQuestion( questionId, answerTextId, function( err, data ) {
                if( err ) {
                    renderError( err );
                    return;
                }

                var answers = questionsHash[ questionId ].answers;
                for( var i = 0; i < answers.length; i++ ) {
                    if( answers[ i ].id == answerTextId ) {
                        delete answers[ i ];
                    }
                }

                renderQuestions();
            });
        }

    }

    //  D O C U M E N T   R E A D Y
    //========================================================================= 
    $(function() {
        //
        //  Initial Render of Questions
        //
        renderQuestions();
        renderStats();

        //
        //  Attach event handlers
        //
        
        //  Questions
        $( document ).on( 'click', '#addNewQuestionBtn', addNewQuestionBtn_click );
        $( document ).on( 'click', '.view-question', viewQuestionBtn_click );
        $( document ).on( 'click', '.delete-question', deleteQuestionBtn_click );
        $( document ).on( 'click', '.update-question-text', updatedQuestionText_click );
        $( document ).on( 'click', '.view-update-question', viewUpdateQuestionBtn_click )
        $( document ).on( 'keydown', '.question-text-input', dispatchEnterKey( updatedQuestionText_click ) );
        $( document ).on( 'keydown', '.new-question-text', dispatchEnterKey( addNewQuestionBtn_click ) );

        //  Answers
        $( document ).on( 'click', '.new-answer-text', addNewAnswerBtn_click );
        $( document ).on( 'click', '.remove-answer-text', deleteAnswer_click );
        $( document ).on( 'keydown', '.new-answer-text-input', dispatchEnterKey( addNewAnswerBtn_click ) );
    })

    //
    //  T E M P L A T E S
    //========================================================================= 
    var templates = {
        error: Handlebars.compile( $('#error-template').html() ),
        question: Handlebars.compile( $('#question-template').html() ),
        stats: Handlebars.compile( $('#question-stats-template').html() )
    }

})( jQuery, window );
describe('Quiz Game', () => {
     beforeEach(() => {
        cy.login('cypresstest@gmail.com', '123456');
    });

    it('should start a quiz and answer questions', () => {
        cy.contains('General Knowledge').click();
        cy.url().should('include', '/quiz/general');
        
        cy.wait(3000);
        
        cy.get('h2').should('contain', '1.');
        cy.get('.QuizList').should('have.length', 4);
        
        cy.get('body').then($body => {
            for (let i = 0; i < 5; i++) {
                cy.get('.QuizList').first().click();
                cy.wait(1500);
            }
        });
        
        cy.get('h3').should('contain', 'Quiz Completed');
        cy.get('p').should('contain', 'Your Score:');
    })




} )
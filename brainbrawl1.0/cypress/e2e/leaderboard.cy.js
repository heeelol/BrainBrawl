describe('leaderboard', () => {
    beforeEach(() => {
        cy.login('cypresstest@gmail.com', '123456');
    });

    it('should display leaderboard with avatars', () => {
        cy.visit('http://localhost:5173/leaderboard');
        cy.get('table').should('be.visible');
        cy.get('span').should('contain', 'cypresstest');
    })
}) 
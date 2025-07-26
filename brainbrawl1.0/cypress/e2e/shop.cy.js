
describe('Cosmetic Shop', () => {
  beforeEach(() => {
    cy.login('cypresstest@gmail.com', '123456');
    cy.visit('http://localhost:5173/shop');
  });
 
    it('should load shop page', () => {
        cy.get('h1').should('contain', 'Cosmetic Shop');
        cy.get('div').should('contain', 'Your Coins:');
    });

    it('should display shop items', () => {
        cy.get('img').should('have.length.gt', 0);
        cy.get('h2').should('contain', 'Cat Avatar');
    });

    it('should purchase an item', () => {
        cy.get('button').contains('Redeem').first().click();
        cy.get('body').should('contain', 'Successfully purchased');
    });

    it('should show redeemed items', () => {
        cy.get('button').contains('Redeem').first().click();
        cy.wait(1000);
        cy.get('button').should('contain', 'Redeemed');
    });
});


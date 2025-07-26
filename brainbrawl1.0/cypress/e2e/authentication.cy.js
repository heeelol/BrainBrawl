describe('Authentication', () => {
    it('should register a new user', () => {
        cy.visit('http://localhost:5173/register');
        cy.get('input[name="name"]').type('cypresstest');
        cy.get('input[name="email"]').type('cypresstest@gmail.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();
    });

    it('should login existing user', () => {
        cy.login('cypresstest@gmail.com', '123456');
    });


    it('should login and logout existing user', () => {
    cy.login('cypresstest@gmail.com', '123456');

    cy.wait(3000);
    
    cy.get('img[src*="noobbrain"]')
        .should('be.visible')
        .first()
        .click();
 
    cy.contains('button', 'Sign out').click();
    cy.url().should('include', '/');
    })

});
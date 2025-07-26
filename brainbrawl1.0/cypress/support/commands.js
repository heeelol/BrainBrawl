// Custom commands for log in

Cypress.Commands.add('login', (email, password) => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.wait(2000); 
});

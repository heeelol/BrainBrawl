describe('profile', () => {
    beforeEach(() => {
        cy.login('cypresstest@gmail.com', '123456');
        
        cy.wait(3000);
    
        cy.get('img[src*="noobbrain"]')
            .should('be.visible')
            .first()
            .click();
    
        cy.contains('[test-dataid="profile"]', 'Your Profile').click();
    })

    it('should display profile accurately', () => {
        cy.get('img[src*="noobbrain"]')
        .should('be.visible')
        cy.get('[test-dataid="name"]').should('contain', 'cypresstest');
    })
})
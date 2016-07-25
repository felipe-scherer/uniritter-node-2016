module.exports = function () {
   const 
        _ = require('lodash'),
        chai = require('chai'),
        expect = chai.expect;


    
    this.Given(/^a valid product$/, function () {
        this.payload = {
        data: {
            type: 'products',
            attributes: {
                name: 'Nome Produto',
                price: 77,
                brand: 'Marca Produto 1',
                model: 'Modelo Produto 1'
                }
            }
        }
    });
    
   this.When(/^I submit it to the APIB$/, function () {
        const 
            that = this
        
        return this.doHttpRequest('products' , 'post', that.payload)
        .then((response) => {
            that.responseBody = response.body;
            return response;
        })
       .catch(error => {
            that.error = error;
            return error;
        })
    });
    
    
     this.Then(/^I receive a success messageB$/, function () {
       expect(this.responseBody.data.id).not.to.be.undefined;
    });
    
     this.Then(/^the new product id$/, function () {
       expect(this.responseBody.data.id).not.to.be.undefined;
   });
    
   
    this.Given(/^an invalid product that is missing the name$/, function () {
        const payload = {
            data: {
                type: 'products',
                attributes: {
                    name: null,
                    price: -125,
                    brand: 'Produto null',
                    model: 'Produto modelo null'
                }
            }
        };
        
        this.payload = payload;
      
        return payload;
    });
    
       this.Given(/^an invalid product that has a negative price$/, function () {
        const payload = {
            data: {
                type: 'products',
                attributes: {
                    name: 'Produto negativo',
                    price: -1,
                    brand: 'Produto negativo',
                    model: 'Produto negativo'
                }
            }
        };
      
        this.payload = payload;
      
        return payload;
    });
    
}

module.exports = function () {
    const 
        _ = require('lodash'),
        chai = require('chai'),
        expect = chai.expect;


    this.Given(/^an existing order with a new status$/, function () {
        const 
            that = this,
            payload = {
            data: {
                type: 'orders',
                attributes: {
                    items: [{ product_id: '598b04ea-8c20-4240-9c2b-1d36350a8d33', quantity: 1}]
                    }
                }
            }
        

        return this.doHttpRequest('orders', 'post', payload)
        .then((response) => {
            that.Order = response.body;
            return response;
        });
    });
    
    this.When(/^I search this order$/, function () {
        const 
            that = this,
            id = this.Order.data.id;
        return this.doHttpRequest('orders/' + id, 'get')
        .then((response) => {
            that.responseBody = JSON.parse(response.body);
            return response;
        });
    });
    
    this.Then(/^I receive the order data$/, function () {
        expect(this.responseBody.data).not.to.be.undefined;
    });
    
    this.Then(/^its status is (.*)$/, function (status) {
        expect(this.responseBody.data.attributes.status).to.equal(status);
    });
    
    this.Then(/^wait a few seconds$/, function (callback) {
        setTimeout(callback, 4000);
    });
    
   
    
this.Then(/^it moves to a paid status$/, function () {
    const 
        that = this,
        new_id = that.responseBody.data.id;
        
        return this.doHttpRequest('orders/' +new_id, 'get')
        .then((response) => {
            var body = JSON.parse(response.body);
            
            expect(body.data.attributes.status).to.equal('paid');
            return response;
        });
    });
    
    this.Given(/^an invalid order that is missing an item quantity$/, function () {

        const payload = {
            data: {
                type: 'orders',
                attributes: {
                    items: [{ product_id: '598b04ea-8c20-4240-9c2b-1d36350a8d33', quantity: -1}]
                }
            }
        };
      
        this.payload = payload;
      
        return payload;
   });
   
   this.Given(/^an invalid order that has an invalid format in product_id$/, function () {

        const payload = {
            data: {
                type: 'orders',
                attributes: {
                    items: [{ product_id: '123', quantity: 1}]
                }
            }
        };
      
        this.payload = payload;
      
        return payload;
   });    
   
   this.Given(/^a valid order$/, function () {
        this.payload = {
            data: {
                type: 'orders',
                attributes: {
                    items: [{ product_id: '598b04ea-8c20-4240-9c2b-1d36350a8d33', quantity: 1}]
                    }
                }
            }
    });
    
    this.When(/^I submit it to the API$/, function () {
        const 
            that = this;
        return this.doHttpRequest('orders', 'post', that.payload)
        .then((response) => {
            that.responseBody = response.body;
            return response;
        })
        .catch(error => {
            that.error = error;
            return error;
        })
    });
    

    
    this.Then(/^the new order id$/, function () {
        expect(this.responseBody.data.id).not.to.be.undefined;
    });
    
    
    this.Then(/^I receive a success message$/, function () {
        expect(this.responseBody.data).not.to.be.undefined;
    });
    
    // this.Then(/^the new (\w+) id$/, function (endpoint) {
    //     expect(this.newId).not.to.be.undefined;
    // });
    
    this.Then(/^I receive an error response$/, function () {
        expect(this.error.body).not.to.be.undefined;
    });
    
    this.Then(/^a message saying that (.*)$/, function (notification) {
        if(notification=="item.quantity is mandatory") {
	        expect(this.error.body.errors[0].validation.keys[0]).to.equal("data.attributes.items.0.quantity");
        }
        if(notification=="product_id must be a uuid") {
	        expect(this.error.body.errors[0].validation.keys[0]).to.equal("data.attributes.items.0.product_id");
        }
    });
    
    
}

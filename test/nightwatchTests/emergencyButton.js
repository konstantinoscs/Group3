module.exports = {
  'emergencyButtonTest':function(client){
    client
    .url("localhost:4000/search.html")
    .useCss()
    .waitForElementVisible('body',1000)
    .assert.visible('.emergency')
    .click('.emergency')
    .waitForElementVisible('body',1000)
    .assert.urlEquals("http://localhost:4000/emergency.html")
    .end()
  }
}

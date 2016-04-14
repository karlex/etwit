describe('twit lent', function() {
    var twitList;

    beforeEach(function() {
        browser.get('http://localhost:9000/');

        twitList = element.all(by.repeater('twit in twits'));
    });

    it('should list twits', function() {
        expect(twitList.count()).toBeGreaterThan(0);

        // TODO: придумать как выполнить аналогичную проверку в условиях меняющегося списка
        //expect(twitList.count()).toEqual(2);
        //expect(twitList.get(1).getText()).toEqual('build an angular app');
    });

    it('should add a twit', function() {
        var addTwit = element(by.model('message'));
        var addButton = element(by.css('[value="Отправить"]'));

        addTwit.sendKeys('@vasya hello world #greeting');
        addButton.click();

        expect(twitList.get(0).getText()).toEqual('Александр Пушкин\n@vasya hello world #greeting');
    });

    it('should has tag cloud', function() {

    });

    it('should add a tag to lent filter', function() {
        var someTag = element(by.css('[value="Отправить"]'))
    });
});
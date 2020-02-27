//fake db
let users = [];
let articles = [{content: 'here is some content 1', visibility:'public', author:'42', title:'testArticle1', article_id:'articleid1'}, 
                {content: 'here is some content 2', visibility:'private', author:'42', title:'testArticle2', article_id:'articleid2'},
                {content: 'here is some content 3', visibility:'logged_in', author:'42', title:'testArticle3', article_id:'articleid3'},
                {content: 'here is some content 4', visibility:'private', author:'43', title:'testArticle4', article_id:'articleid4'},
                {content: 'here is some content 5', visibility:'logged_in', author:'42', title:'testArticle5', article_id:'articleid5'},
                {content: 'here is some content 6', visibility:'public', author:'42', title:'testArticle6', article_id:'articleid6'}];

export default {
    users, 
    articles,
};
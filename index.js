
// load the enviroment variables from the .env file
require('dotenv').config();

// require the google news api
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.API_KEY); // api key fom .env

// stringContainsCategories - returns a boolean indicating whether string contains all categories
function stringContainsCategories(string, categories) {
	let containsCategory = true;
	
	categories.forEach((term) => {
		if (!string.toLowerCase().includes(term)) {
			containsCategory = false;
		}
	});
	
	return containsCategory;
}

// stringContainsCovid - returns a boolean indicating whether a string contains covid
function stringContainsCovid(string) {
  // example coronavirus terms
  const covidTerms = ['covid', 'coronavirus', 'covid-19', 'wuhan', 'pandemic', 'virus'];
  let containsCovid = false;

  // iterate through the list of terms to determine if the string contains covid
  covidTerms.forEach((term) => {
    if (string.toLowerCase().includes(term)) {
      containsCovid =  true;
    }
  });

  return containsCovid;
}

// articleContainsCategory - returns a boolean indicating whether the article contains the categories
function articleContainsCategory(article, categories) {
	// iterate through each property in the article object for strings
	Object.keys(article).forEach(propKey => {
		if (stringContainsCategories(article[propKey] + '', categories)) {
			return true;
		}
	});
	return false;
}

// articleContainsCovid - returns a boolean indicating whether the article contains covid
function articleContainsCovid(article) {
  // iterate through each property in the article object for strings
  Object.keys(article).forEach(propKey => {
    if (stringContainsCovid(article[propKey] + '')) {
      return true;
    }
  });
  return false;
}

// getCategoryHeadlines - returns an array of all categorized headlines
async function getCategoryHeadlines(language, country, categories) {
	//Get headlines
	const articles = (await newsapi.v2.topHeadlines({language, country})).articles;
	
	// reduce to a set of articles to a subset that contains articles
	const categorizedArticles = articles.reduce((safe, article) => {
		if (articleContainsCategory(article, categories)) {
			safe.push(article);
		}
		return safe;
	}, []);
	
	return categorizedArticles;
}

// getCovidFreeHeadlines - returns an array of covid free headlines
async function getCovidFreeHeadlines(language, country) {
  // get the headlines
  const articles = (await newsapi.v2.topHeadlines({ language, country })).articles;

  // reduce to a set of articles to a subset without covid
  const covidFree = articles.reduce((safe, article) => {
    // if the article is covid free, add it to the 'safe' array
    if (!articleContainsCovid(article)) {
      safe.push(article);
    }
    return safe;
  }, []);

  // return covidFree articles
  return covidFree;
}

// get the articls and print them
const givenCategories = ['korea']; 

getCovidFreeHeadlines('en', 'us')
  .then((articles) => console.log(articles))
  .catch((rej) => console.log(rej));

getCategoryHeadlines('en', 'us', givenCategories)
  .then((articles) => console.log(articles))
  .catch((rej) => console.log(rej));
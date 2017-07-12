const {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt} = require('graphql');
const rp = require('request-promise');
const DataLoader = require('dataloader');
const dotenv = require('dotenv').config();
const { makeExecutableSchema } = require('graphql-tools');
const key = process.env.LOL_KEY;

const getSummonerByName = (name) => {
  return rp({
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?api_key=${key}`,
    json: true
  });
}

const getSummonerRank = (summonerId) => {
  return rp({
    uri: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId}?api_key=${key}`,
    transform: (body, response, resolveWithFullResponse) => { return body[0] },
    resolveWithFullResponse: true,
    json: true
  });
}

const schemaString = `
  type Summoner {
    profileIconId: Int
    name: String
    summonerLevel: Int
    revisionDate: Int
    id: Int
    accountId: Int
    rank: LeaguePosition
  },
  type LeaguePosition {
    rank: String
    queueType: String
    hotStreak: Boolean
    wins: Int
    veteran: Boolean
    losses: Int
    playerOrTeamId: String
    leagueName: String
    playerOrTeamName: String
    inactive: Boolean
    freshBlood: Boolean
    tier: String
    leaguePoints: Int
  },
  type Query {
    summoner(name: String!): Summoner
  }
`;

const resolverMap = {
  Query: {
    summoner(root, args, context) {
      return getSummonerByName(args.name);
    }
  },
  Summoner: {
    rank(root, args, context) {
      return getSummonerRank(root.id);
    }
  }
}

const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers: resolverMap });

exports.schema = schema;
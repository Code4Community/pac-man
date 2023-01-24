// Contains the funcationalitity for the game state change event, add event, and remove event

import { saveProgram, updateProgram, getProgram } from './DatabaseManager';

// Object for the function library that can access other AWS Services
// import AWS from 'aws-sdk';

// // Set the region 
// AWS.config.update({region: 'us-east-2'});

// // Create the DynamoDB service object
// var ddb = new AWS.DynamoDB({
//     apiVersion: '2012-08-10',
//     httpOptions: {
//     agent: new https.Agent({
//       rejectUnauthorized: true,
//       secureProtocol: "TLSv1_method",
//       ciphers: "ALL"
//     })
//   }
    
// });

// exports.handler = (event, context, callback) => {
//     gameId = event['pathParameters']['gameid']
//     console.log('Received event (', gameId, '): ', event);

//     readState(gameId, context, callback);
// };

// function readState(gameId, context, callback) {
    
//     console.log("readState() called");
    
//     var params = {
//       TableName: 'GameState',
//       Key: {
//         'GameId': {S: gameId}
//       }
//     };
    
//     ddb.getItem(params, 
//         function(err, data) {
            
//             console.log("Handler called");
            
//             if (err) {
//                 console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//                 errorResponse(err.message, context.awsRequestId, callback)
//             }
//             else {
//                 console.log("Added item:", JSON.stringify(data, null, 2));
//                 callback(null, 
//                     {
//                         statusCode: 201,
//                         body: JSON.stringify(data),
//                         headers: {
//                             'Access-Control-Allow-Origin': '*',
//                         },
//                     }
//                 );
//             }
//         }
//     );
// }

// function errorResponse(errorMessage, awsRequestId, callback) {
//     callback(null, {
//       statusCode: 500,
//       body: JSON.stringify({
//         Error: errorMessage,
//         Reference: awsRequestId,
//       }),
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//       },
//     });
//   }



// Using mongoDB
export function publish (program) {
  // First, see if the user has already published by checking local browser storage
  const published = localStorage.getItem('published')
  let id;
  let isNew = false;
  if (published) {
    // If they have, then we need to update the published program
    id = published;
    isNew = true;

  } else {
    // Generate a 6 character random id
    id = Math.random().toString(36).substring(2, 8);
    // Save the id to local browser storage
    localStorage.setItem('published', id);
  }

  // Save the program to the database
  if (isNew) {
    saveProgram(id, program);
  } else {
    updateProgram(id, program);
  }


  return id;
  

}

export function loadProgram(id) {
  // Get the program from the database
  const program = getProgram(id);
  return program;
}


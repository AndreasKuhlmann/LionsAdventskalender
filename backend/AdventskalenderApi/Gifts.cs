using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace AdventskalenderApi
{
    public static class Gifts
    {
        [Function("Gifts")]
        public static async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("Function1");
            logger.LogInformation("C# HTTP trigger function processed a request.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            var data = new[]
            {
                new {
                  front= "1",
                  unlockAt= "Septemer 1, 2021 00=00=00",
                  flipped= false,
                  content= "A partridge in a pear tree",
                },
                new {
                  front= "2",
                  unlockAt= "Septemer 2, 2021 00=00=00",
                  flipped= false,
                  content= "Two turtle doves",
                },
                new {
                  front= "3",
                  unlockAt= "Septemer 3, 2021 00=00=00",
                  flipped= false,
                  content= "Three French hens",
                },
                new {
                  front= "4",
                  unlockAt= "Septemer 4, 2021 00=00=00",
                  flipped= false,
                  content= "Four calling birds",
                },
                new {
                  front= "5",
                  unlockAt= "Septemer 5, 2021 00=00=00",
                  flipped= false,
                  content= "Five golden rings!",
                },
                new {
                  front= "6",
                  unlockAt= "Septemer 6, 2021 00=00=00",
                  flipped= false,
                  content= "Six geese a laying",
                },
                new {
                  front= "7",
                  unlockAt= "Septemer 7, 2021 00=00=00",
                  flipped= false,
                  content= "Seven swans a swimming",
                },
                new {
                  front= "8",
                  unlockAt= "Septemer 8, 2021 00=00=00",
                  flipped= false,
                  content= "Eight maids a milking",
                },
                new {
                  front= "9",
                  unlockAt= "Septemer 9, 2021 00=00=00",
                  flipped= false,
                  content= "Nine ladies dancing",
                },
                new {
                  front= "10",
                  unlockAt= "Septemer 10, 2021 00=00=00",
                  flipped= false,
                  content= "Ten lords a leaping",
                },
                new {
                  front= "11",
                  unlockAt= "Septemer 11, 2021 00=00=00",
                  flipped= false,
                  content= "Eleven pipers piping",
                },
                new {
                  front= "12",
                  unlockAt= "Septemer 12, 2021 00=00=00",
                  flipped= false,
                  content= "12 drummers drumming",
                },
                new {
                  front= "13",
                  unlockAt= "Septemer 13, 2021 00=00=00",
                  flipped= false,
                  content= "12 drummers drumming",
                },
                new {
                  front= "14",
                  unlockAt= "Septemer 14, 2021 00=00=00",
                  flipped= false,
                  content= "A partridge in a pear tree",
                },
                new {
                  front= "15",
                  unlockAt= "Septemer 15, 2021 00=00=00",
                  flipped= false,
                  content= "Two turtle doves",
                },
                new {
                  front= "16",
                  unlockAt= "Septemer 16, 2021 00=00=00",
                  flipped= false,
                  content= "Three French hens",
                },
                new {
                  front= "17",
                  unlockAt= "Septemer 17, 2021 00=00=00",
                  flipped= false,
                  content= "Four calling birds",
                },
                new {
                  front= "18",
                  unlockAt= "Septemer 18, 2021 00=00=00",
                  flipped= false,
                  content= "Five golden rings!",
                },
                new {
                  front= "19",
                  unlockAt= "Septemer 19, 2021 00=00=00",
                  flipped= false,
                  content= "Six geese a laying",
                },
                new {
                  front= "20",
                  unlockAt= "Septemer 20, 2021 00=00=00",
                  flipped= false,
                  content= "Seven swans a swimming",
                },
                new {
                  front= "21",
                  unlockAt= "Septemer 21, 2021 00=00=00",
                  flipped= false,
                  content= "Eight maids a milking",
                },
                new {
                  front= "22",
                  unlockAt= "Septemer 22, 2021 00=00=00",
                  flipped= false,
                  content= "Nine ladies dancing",
                },
                new {
                  front= "23",
                  unlockAt= "Septemer 23, 2021 00=00=00",
                  flipped= false,
                  content= "Ten lords a leaping",
                },
                new {
                  front= "24",
                  unlockAt= "Septemer 24, 2021 00=00=00",
                  flipped= false,
                  content= "Eleven pipers piping",
                },
            };
            await response.WriteAsJsonAsync(data);
            return response;
        }
    }
}

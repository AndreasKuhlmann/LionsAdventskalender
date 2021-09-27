using System.Net;
using System.Threading.Tasks;
using AdventskalenderApi.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AdventskalenderApi
{
    public static class Gewinne
    {
        [Function("Gewinne")]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("Gewinne");
            var config = executionContext.InstanceServices.GetService<IConfiguration>();
            var gewinneService = executionContext.InstanceServices.GetService<IGewinnService>();
            logger.LogInformation("C# HTTP trigger function processed a request.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            var data = new[]
            {
                new {
                  front= "1",
                  unlockAt= "Septemer 1, 2021 00:00:00",
                  flipped= false,
                  content= @"1337, Optik am Haarenufer, Inh. Niko Bolle, Einkaufsgutschein, 100 €
3940, Florian Isensee GmbH, Einkaufsgutschein, 100 €
3696, Löschau Oldenburger Wohngarten, Einkaufsgutschein, 100 €
",
                },
                new {
                  front= "2",
                  unlockAt= "Septemer 2, 2021 00:00:00",
                  flipped= false,
                  content= @"23, Gebäudereinigung Pu-Ma Cristallum, Gutscheine für Gebäudereinigung 3 á 50,- €, 150 €
643, Köhn & Plambeck, Tankgutschein, 100 €
4732, Brillen Hess, Einkaufsgutschein, 100 €
",
                },
                new {
                  front= "3",
                  unlockAt= "Septemer 3, 2021 00:00:00",
                  flipped= false,
                  content= @"1863, Optik im Jaguarhaus, Einkaufsgutschein, 100 €
789, Humanitas Ambulante Krankenpflege, Bargutschein , 100 €
5680, Onken, Einkaufsgutschein, 150 €",
                },
                new {
                  front= "4",
                  unlockAt= "Septemer 4, 2021 00:00:00",
                  flipped= false,
                  content= @"162, Badgestalten GmbH, Einkaufsgutschein, 150 €
1776, GVO Versicherung, 2 Gutscheine fürs Casablanca Kino à 50 €, 100 €
4647, Buchhandlung Thye, Einkaufsgutschein, 150 €
",
                },
                new {
                  front= "5",
                  unlockAt= "Septemer 5, 2021 00:00:00",
                  flipped= false,
                  content= @"<b style='color:darkred'>1379</b>: Landessparkasse zu Oldenburg (LzO), 1 x Wahlabo Schauspiel Oldenburger Staatstheater, 256 €<br/>
<b style='color:darkred'>5786</b>: Hankens Apotheke, Einkaufsgutschein, 100 €<br/>
<b style='color:darkred'>5274</b>: Hankens Apotheke, Einkaufsgutschein, 100 €",
                },
                new {
                  front= "6",
                  unlockAt= "Septemer 6, 2021 00:00:00",
                  flipped= false,
                  content= "Six geese a laying",
                },
                new {
                  front= "7",
                  unlockAt= "Septemer 7, 2021 00:00:00",
                  flipped= false,
                  content= "Seven swans a swimming",
                },
                new {
                  front= "8",
                  unlockAt= "Septemer 8, 2021 00:00:00",
                  flipped= false,
                  content= "Eight maids a milking",
                },
                new {
                  front= "9",
                  unlockAt= "Septemer 9, 2021 00:00:00",
                  flipped= false,
                  content= "Nine ladies dancing",
                },
                new {
                  front= "10",
                  unlockAt= "Septemer 10, 2021 00:00:00",
                  flipped= false,
                  content= "Ten lords a leaping",
                },
                new {
                  front= "11",
                  unlockAt= "Septemer 11, 2021 00:00:00",
                  flipped= false,
                  content= "Eleven pipers piping",
                },
                new {
                  front= "12",
                  unlockAt= "Septemer 12, 2021 00:00:00",
                  flipped= false,
                  content= "12 drummers drumming",
                },
                new {
                  front= "13",
                  unlockAt= "Septemer 13, 2021 00:00:00",
                  flipped= false,
                  content= "12 drummers drumming",
                },
                new {
                  front= "14",
                  unlockAt= "Septemer 14, 2021 00:00:00",
                  flipped= false,
                  content= "A partridge in a pear tree",
                },
                new {
                  front= "15",
                  unlockAt= "Septemer 15, 2021 00:00:00",
                  flipped= false,
                  content= "Two turtle doves",
                },
                new {
                  front= "16",
                  unlockAt= "Septemer 16, 2021 00:00:00",
                  flipped= false,
                  content= "Three French hens",
                },
                new {
                  front= "17",
                  unlockAt= "Septemer 17, 2021 00:00:00",
                  flipped= false,
                  content= "Four calling birds",
                },
                new {
                  front= "18",
                  unlockAt= "Septemer 18, 2021 00:00:00",
                  flipped= false,
                  content= "Five golden rings!",
                },
                new {
                  front= "19",
                  unlockAt= "Septemer 19, 2021 00:00:00",
                  flipped= false,
                  content= "Six geese a laying",
                },
                new {
                  front= "20",
                  unlockAt= "Septemer 20, 2021 00:00:00",
                  flipped= false,
                  content= "Seven swans a swimming",
                },
                new {
                  front= "21",
                  unlockAt= "Septemer 21, 2021 00:00:00",
                  flipped= false,
                  content= "Eight maids a milking",
                },
                new {
                  front= "22",
                  unlockAt= "Septemer 22, 2021 00:00:00",
                  flipped= false,
                  content= "Nine ladies dancing",
                },
                new {
                  front= "23",
                  unlockAt= "Septemer 23, 2021 00:00:00",
                  flipped= false,
                  content= "Ten lords a leaping",
                },
                new {
                  front= "24",
                  unlockAt= "Septemer 24, 2021 00:00:00",
                  flipped= false,
                  content= "Eleven pipers piping",
                },
            };
            await response.WriteAsJsonAsync(data);
            return response;
        }
    }
}

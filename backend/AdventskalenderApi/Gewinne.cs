using System;
using System.Net;
using System.Threading.Tasks;
using AdventskalenderApi.DataAccess;
using AdventskalenderApi.DataAccess.Models;
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
            var context = executionContext.InstanceServices.GetService<AdventskalenderApiContext>();
            var connectionString = config.GetConnectionString("ApplicationDBContext");
            logger.LogInformation("C# HTTP trigger function processed a request.");
            var gewinneService = executionContext.InstanceServices.GetService<IGewinnService>();
            if (gewinneService == null)
                return req.CreateResponse(HttpStatusCode.InternalServerError);

            var data = new[]
            {
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Losnummer = 1,
                    Beschreibung = "test"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Losnummer = 23,
                    Beschreibung = "Gebäudereinigung Pu-Ma Cristallum, Gutscheine für Gebäudereinigung 3 á 50,- €, 150 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Losnummer = 643,
                    Beschreibung = "Köhn & Plambeck, Tankgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Losnummer = 4732,
                    Beschreibung = "Brillen Hess, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Losnummer = 1863,
                    Beschreibung = "Optik im Jaguarhaus, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Losnummer = 789,
                    Beschreibung = "Humanitas Ambulante Krankenpflege, Bargutschein , 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Losnummer = 5680,
                    Beschreibung = "Onken, Einkaufsgutschein, 150 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Losnummer = 162,
                    Beschreibung = "Badgestalten GmbH, Einkaufsgutschein, 150 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Losnummer = 1776,
                    Beschreibung = "GVO Versicherung, 2 Gutscheine fürs Casablanca Kino à 50 €, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Losnummer = 4647,
                    Beschreibung = " Buchhandlung Thye, Einkaufsgutschein, 150 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Losnummer = 1379,
                    Beschreibung = "Landessparkasse zu Oldenburg (LzO), 1 x Wahlabo Schauspiel Oldenburger Staatstheater, 256 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Losnummer = 5786,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Losnummer = 5274,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Losnummer = 1379,
                    Beschreibung = "Landessparkasse zu Oldenburg (LzO), 1 x Wahlabo Schauspiel Oldenburger Staatstheater, 256 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Losnummer = 5786,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Losnummer = 5274,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Losnummer = 1776,
                    Beschreibung = "GVO Versicherung, 2 Gutscheine fürs Casablanca Kino à 50 €, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Losnummer = 4647,
                    Beschreibung = " Buchhandlung Thye, Einkaufsgutschein, 150 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Losnummer = 1379,
                    Beschreibung = "Landessparkasse zu Oldenburg (LzO), 1 x Wahlabo Schauspiel Oldenburger Staatstheater, 256 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Losnummer = 5786,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Losnummer = 5274,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Losnummer = 1379,
                    Beschreibung = "Landessparkasse zu Oldenburg (LzO), 1 x Wahlabo Schauspiel Oldenburger Staatstheater, 256 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Losnummer = 5786,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Losnummer = 5274,
                    Beschreibung = "Hankens Apotheke, Einkaufsgutschein, 100 €"
                }
                };
            gewinneService.Add(data);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(data);
            return response;
        }
    }
}

using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AdventskalenderApi.DataAccess;
using AdventskalenderApi.DataAccess.Models;
using AdventskalenderApi.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp.PixelFormats;

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
            //var config = executionContext.InstanceServices.GetService<IConfiguration>();
            //var context = executionContext.InstanceServices.GetService<AdventskalenderApiContext>();
            //var connectionString = config.GetConnectionString("ApplicationDBContext");
            logger.LogInformation("C# HTTP trigger function processed a request.");
            //var gewinneService = executionContext.InstanceServices.GetService<IGewinnService>();
            //if (gewinneService == null)
            //    return req.CreateResponse(HttpStatusCode.InternalServerError);

            var data = new[]
            {
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung="Michael Stephan - Photograph,Haubentaucherring 13a,26135 OL,Fotoshooting,100€",
                    Losnummer=1664,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung="Gemeinnützige Werkstätten OL e. V.,Rennplatzstraße 203,26125 OL,2xGutscheine,50€",
                    Losnummer=5102,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung="Hautnah,Herbartgang 13,26122 OL,Gutschein,150€",
                    Losnummer=5935,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="Brillen Hess,Hauptstraße 61,26122 OL,Gutschein,100€",
                    Losnummer=6582,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="OLer Wohngarten,Stubbenweg 29,26125 OL,Gutschein,100€",
                    Losnummer=1455,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="bruns Männermode,Haarenstraße 57-60,26122 OL,Gutschein,100€",
                    Losnummer=324,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=3,
                    Beschreibung="CEWE Stiftung & CO. KGaA,Meerweg 30 - 32,26133 OL,3 Gutscheine für Fotobuch,50€",
                    Losnummer=2927,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=3,
                    Beschreibung="Scharmann`s,Haarenstraße 58,26122 OL,Gutschein,100€",
                    Losnummer=2578,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=3,
                    Beschreibung="GSG Bau- und Wohngesellschaft,Straßburger Str. 8,26123 OL,5 Theatergutscheine für Theater Laboratorium,25€",
                    Losnummer=478,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=4,
                    Beschreibung="Innenleben,Baumgartenstraße 4,26122 OL,Gutschein,100€",
                    Losnummer=4938,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=4,
                    Beschreibung="Bettenhaus Uwe Heintzen GmbH,Hauptstraße 109,26131 OL,Gutschein,250€",
                    Losnummer=2020,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=4,
                    Beschreibung="Nölker & Nölker Teehandel,Mottenstraße 2,26122 OL,Gutschein,100€",
                    Losnummer=1133,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=5,
                    Beschreibung="Park der Gärten gGmbH,Elmendorfer Str.40,26160 Bad Zwischenahn,2 Jahreskarten",
                    Losnummer=1452,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=5,
                    Beschreibung="laufrausch,Hauptstraße 28,26122 OL,Gutschein,100€",
                    Losnummer=735,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=5,
                    Beschreibung="bruns Männermode Grosse Grössen,Haarenstraße 57-60,26122 OL,Gutschein,100€",
                    Losnummer=5237,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Friseur Jens Runge,Nadorster Straße 162,26123 OL,Gutschein Behandlung oder Produkte,100€",
                    Losnummer=2395,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Onken,Lange Straße 62,26122 OL,Gutschein,150€",
                    Losnummer=350,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Buch Brader,Haarenstraße 8,26122 OL,Büchergutschein,100€",
                    Losnummer=1665,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,Gutscheine für den theater hof 19,100€",
                    Losnummer=1525,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Klosterschänke Hude,Von-Witzleben-Allee 3,27798 Hude,Gutschein,100€",
                    Losnummer=6171,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Bäckerei Janssen,Scharreler Damm 11,26188 Edewecht,Geschenkgutschein,100€",
                    Losnummer=848,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="Heinrich v. d. Pütten,Gerhard-Stalling-Straße 51,26135 OL,Glasreinigung,100€",
                    Losnummer=3416,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="Sonnen-Apotheke,Eichenstraße 17,26131 OL,Gutschein,100€",
                    Losnummer=1909,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,Gutscheine für das OLisches Staatstheater",
                    Losnummer=5180,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="Optiker Schulz,Achternstraße 30/31,26122 OL,Gutschein einmalig 50% Rabatt beim Kauf einer Brille",
                    Losnummer=886,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="TiTo. Manufaktur,Bergstr. 2,26122 OL,Gutschein,150€",
                    Losnummer=2299,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="bruns Berufsmode,Posthalterweg 17,26129 OL,Gutschein,100€",
                    Losnummer=371,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="Optik im Jaguarhaus,Heiligengeistwall 8,26122 OL,Gutschein,100€",
                    Losnummer=4278,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="Landessparkasse zu OL,Berliner Platz 1,26123 OL,Gutscheine für das Staatstheater OL,100€",
                    Losnummer=6812,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="Corpus Sport-und Gesundheitszentrum,Giesenweg 19,26133 OL,Ärztl. Trainingsberatung 1/4 Jahr physioth. Anleitung",
                    Losnummer=2709,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Brillen Hess,Hauptstraße 61,26122 OL,Gutschein,100€",
                    Losnummer=5998,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Dr. Bönkhoff und Gilbers mbB,Hauptstraße 35,26122 OL,10xOL Gutscheine,10€",
                    Losnummer=4752,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Schmidt,Lauterbach & Partner Steuerberater,Brombeerweg 55,26180 Rastede,Gutschein für Uhren,Schmuck Pareigat,150€",
                    Losnummer=6793,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=12,
                    Beschreibung="Hankens Flora Apotheke,Bahnhofstraße 15,26209 Hatten,Gutschein,100€",
                    Losnummer=169,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=12,
                    Beschreibung="Barometer M-Verlag,Raiffeisenstr. 25,26122 OL,2xDas Barometer (Buch/App),50€",
                    Losnummer=3079,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=12,
                    Beschreibung="Autohaus Frank Voigt,Bloherfelder Str. 242-244,26129 OL,Gutschein,200€",
                    Losnummer=1489,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13,
                    Beschreibung="GVO Versicherung,GVO Platz 1,26160 Bad Zwischenahn,Gutscheine für das Hotel Kolb - Urlaub am Meer,100€",
                    Losnummer=1602,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13,
                    Beschreibung="Florian Isensee GmbH,Haarenstraße 20,26122 OL,Gutschein,100€",
                    Losnummer=4257,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13,
                    Beschreibung="Ev. Familien-Bildungsstätte OL,Haareneschstraße 58a,26121 OL,Kurse bei der Ev. Familien-Bildungsstätte OL,150€",
                    Losnummer=2524,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=14,
                    Beschreibung="GVO Versicherung,GVO Platz 1,26160 Bad Zwischenahn,Gutscheine für das Restaurant Ahrenshof,100€",
                    Losnummer=3806,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=14,
                    Beschreibung="Schmidt,Lauterbach & Partner Steuerberater,Brombeerweg 55,26180 Rastede,Gutscheine für Rasteder Geschäfte,150€",
                    Losnummer=541,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=14,
                    Beschreibung="Neotaste GmbH,Saarbrücker Str. 37 AB,10405 Berlin,2x 12 Monate Geschenkbox,50€",
                    Losnummer=660,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=15,
                    Beschreibung="Hankens Alexander Apotheke,Alexanderstraße 125,26121 OL,Gutschein,100€",
                    Losnummer=3289,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=15,
                    Beschreibung="OLisches Staatstheater,Theaterwall 28,26122 OL,Theatergutscheine,150€",
                    Losnummer=2881,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=15,
                    Beschreibung="Cassens GmbH&CoKG,Bremer Heerstraße 460,26135 OL,3 Gutscheine,50€",
                    Losnummer=3074,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=16,
                    Beschreibung="Optik am Haarenufer,Inh. Niko Bolle,Haarenufer 31,26122 OL,Gutschein,100€",
                    Losnummer=5599,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=16,
                    Beschreibung="Tecis Finanzdienstleistungen AG,Cloppenburger Straße 3,26135 OL,Gutschein,100€",
                    Losnummer=941,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=16,
                    Beschreibung="Phönix Bar & Restaurant,Ehnernstraße 15,26121 OL,Gutschein,150€",
                    Losnummer=5750,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=17,
                    Beschreibung="Marien-Apotheke,Marienstraße 1,26121 OL,Gutschein,100€",
                    Losnummer=6806,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=17,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,Gutscheine für das OLisches Staatstheater,100€",
                    Losnummer=5350,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=17,
                    Beschreibung="La Vista Das Brillen Atelier,Gaststraße. 28,26122 OL,Gutschein,150€",
                    Losnummer=4655,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=18,
                    Beschreibung="Beauty Concept by Stefanie Junghans,Donnerschweerstr. 57,26123 OL,Gutschein Kosmetik,150€",
                    Losnummer=659,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=18,
                    Beschreibung="Hankens Hansa Apotheke,Alter Postweg 125,26133 OL,Gutschein,100€",
                    Losnummer=6766,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=18,
                    Beschreibung="CEWE Stiftung & CO. KGaA,Meerweg 30 - 32,26133 OL,3 Gutscheine für Fotobuch,50€",
                    Losnummer=6314,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=19,
                    Beschreibung="Vorwerk Gartenwelt,OLer Str. 100,26180 Rastede,Gutschein,100€",
                    Losnummer=4930,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=19,
                    Beschreibung="Optik am Haarenufer,Inh. Niko Bolle,Haarenufer 31,26122 OL,2 Gutscheine,100€",
                    Losnummer=3930,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=19,
                    Beschreibung="GSG Bau- und Wohngesellschaft,Straßburger Str. 8,26123 OL,5 Theatergutscheine für Theater Laboratorium,25€",
                    Losnummer=669,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=20,
                    Beschreibung="GVO Versicherung,GVO Platz 1,26160 Bad Zwischenahn,Gutscheine für das Restaurrant Jagdhaus Eiden,100€",
                    Losnummer=6896,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=20,
                    Beschreibung="Hankens Haaren Apotheke,Haarenstraße 38,26122 OL,Gutschein,100€",
                    Losnummer=1326,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=20,
                    Beschreibung="COMMERZIAL TREUHAND GmbH,Wilhelmsh.-Heerstraße 79,26125 OL,Gutschein für Schuhhaus Schütte,150€",
                    Losnummer=1588,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=21,
                    Beschreibung="Schmidt,Lauterbach & Partner Steuerberater,Brombeerweg 55,26180 Rastede,Gutscheine für Restaurant Antalya,150€",
                    Losnummer=1101,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=21,
                    Beschreibung="Buch Brader,Haarenstraße 8,26122 OL,Büchergutschein,100€",
                    Losnummer=3925,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=21,
                    Beschreibung="Michael Stephan - Photograph,Haubentaucherring 13a,26135 OL,Fotoshooting,100€",
                    Losnummer=411,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=22,
                    Beschreibung="Wachsstübchen,Alexanderstraße 116,26121 OL,4xGutscheine für Haarentfernung und Fußpflege,25€",
                    Losnummer=461,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=22,
                    Beschreibung="Rosemarie und Dieter Krah,LC OL Lappan,26180 Rastede,Bargeld 120€",
                    Losnummer=3281,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=22,
                    Beschreibung="Löschau,Melkbrink 15,26121 OL,Gutschein,100€",
                    Losnummer=5288,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=23,
                    Beschreibung="Hankens Apotheke in den Höfen,Grüne Straße 10,26121 OL,Gutschein,100€",
                    Losnummer=1901,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=23,
                    Beschreibung="Eventhaus Müggenkrug,Elsflether Str. 53,26125 OL,Gutschein,150€",
                    Losnummer=5458,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=23,
                    Beschreibung="Christina Schulz,Galerie für Schmuck,Johannisstraße 15,26121 OL,Gutschein für ein Schmuckstück,150€",
                    Losnummer=6763,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=24,
                    Beschreibung="D'OR Galerie und Goldschmiede,Herbartgang 11,26122 OL,Schmuckstück,300€",
                    Losnummer=772,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=24,
                    Beschreibung="Golfclub am Meer,Ebereschenstraße 10,26160 Bad Zwischenahn,Platzerlaubnis inkl. Prüfungsgebühr für 2 Pers.",
                    Losnummer=6517,
                },
                new Gewinn
                { 
                    Id = Guid.NewGuid(),
                    Tag=24,
                    Beschreibung="Volkswagen Zentrum OL,Bremer Heerstraße 1,26135 OL,Fahrt mit einem VW ID in die Autostadt mit 1 ÜN für 2 Pers.",
                    Losnummer=3234,
                },
            };

            // Save, just for fun...
            //gewinneService.Add(data);

            //var today = new DateTime(2024, 12, 24);
            var today = DateTime.Today;

            int dayOfDecember = today.Month == 12 ? today.Day : (today.Month is > 0 and < 11 ? 24 : 0);
            data.ToList().ForEach(d =>
            {
                // clear only in december before christmas day...
                if (d.Tag > dayOfDecember)
                {
                       d.Beschreibung = String.Empty;
                       d.Losnummer = 0;
                }
            });
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(data);
            return response;
        }
    }
}

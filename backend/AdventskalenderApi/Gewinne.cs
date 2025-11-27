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
                    Tag = 1,
                    Beschreibung = "Michael Stephan - Photograph, Haubentaucherring 13a, 26135 OL, Fotoshooting 100 €",
                    Losnummer = 3394
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Beschreibung = "Gemeinnützige Werkstätten OL e. V., Rennplatzstraße  203, 26125 OL, 2 Gutscheine je 50,- €",
                    Losnummer = 6754
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Beschreibung = "Hankens Apotheke in den Höfen, Grüne Straße 10, 26121 OL, Einkaufsgutschein 100 €",
                    Losnummer = 80
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Beschreibung = "Brillen Hess, Hauptstraße 61, 26122 OL, Brillengutschein 100 €",
                    Losnummer = 6191
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Beschreibung = "OLer Wohngarten, Stubbenweg 29, 26125 OL, Einkaufsgutschein 100 €",
                    Losnummer = 3029
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                Beschreibung = "bruns Männermode, Haarenstraße 57-60, 26122 OL, Einkaufsgutschein 100 €",
                Losnummer = 6185
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Beschreibung = "Scharmann`s, Haarenstraße 58, 26122 OL, Einkaufsgutschein 100 €",
                    Losnummer = 3530
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 OL, 2 Gutscheine für Fotobuch je 50 €",
                    Losnummer = 2879
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Beschreibung = "GSG Bau- und Wohngesellschaft, Straßburger Str. 8, 26123 OL, 5 Theatergutscheine für Theater Laboratorium je 25 €",
                    Losnummer = 910
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Beschreibung = "Innenleben, Baumgartenstraße 4, 26122 OL, Gutschein 100 €",
                    Losnummer = 4517
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Beschreibung = "Nölker & Nölker Teehandel, Mottenstraße 2, 26122 OL, Gutschein 100 €",
                    Losnummer = 6572
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Beschreibung = "Rosemarie und Dieter Krah, LC OL Lappan, 26180 Rastede, Bargeld 120 €",
                    Losnummer = 4414
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Beschreibung = "bruns Männermode Grosse Grössen, Haarenstraße 57-60, 26122 OL, Einkaufsgutschein 100 €",
                    Losnummer = 5577
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Beschreibung = "laufrausch, Hauptstraße 28, 26122 OL, Gutschein 100 €",
                    Losnummer = 6801
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Beschreibung = "Marien-Apotheke, Marienstraße 1, 26121 OL, Gutschein 100 €",
                    Losnummer = 4583
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Beschreibung = "Onken, Lange Straße 62, 26122 OL, Einkaufsgutschein 150 €",
                    Losnummer = 5464
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Beschreibung = "Buch Brader, Haarenstraße 8, 26122 OL, Büchergutschein 150 €",
                    Losnummer = 3932
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Beschreibung = "Landessparkasse zu OL (LzO), Berliner Platz 1, 26123 OL, Gutscheine für das OLisches Staatstheater 200 €",
                    Losnummer = 1110
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 7,
                Beschreibung = "Klosterschänke Hude, Von-Witzleben-Allee 3, 27798 Hude, Gutschein Klosterschänke plus Neotaste Geschenkbox je 50,- €",
                Losnummer = 5948
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 7,
                Beschreibung = "Landessparkasse zu OL (LzO), Berliner Platz 1, 26123 OL, Gutscheine für den theater hof 19 100 €",
                Losnummer = 2563
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 7,
                Beschreibung = "Wachsstübchen, Alexanderstraße 116,  26121 OL, 4 Gutscheine je 25 € ",
                Losnummer = 5759
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 8,
                Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 OL, 2 Gutscheine für Fotobuch je 50 €",
                Losnummer = 1077
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 8,
                Beschreibung = "Heinrich v. d. Pütten, Gerhard-Stalling-Straße 51, 26135 OL, Fensterreinigung 100 €",
                Losnummer = 3050
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 8,
                Beschreibung = "Sonnen-Apotheke, Eichenstraße 17, 26131 OL, Gutschein 100 €",
                Losnummer = 5837
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 9,
                Beschreibung = "TiTo. Manufaktur, Bergstr. 2, 26122 OL, Anfertigung eines Schmuckstückes 100 €",
                Losnummer = 5876
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 9,
                Beschreibung = "bruns Berufsmode, Posthalterweg 17, 26129 OL, Einkaufsgutschein 100 €",
                Losnummer = 4491
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 9,
                Beschreibung = "Michael Stephan - Photograph, Haubentaucherring 13a, 26135 OL, Fotoshooting 100 €",
                Losnummer = 4277
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 10,
                Beschreibung = "Corpus Sport-und Gesundheitszentrum, Giesenweg 19, 26133 OL, Ärztl. Trainingsberatung 1/4 Jahr physioth. Anleitung",
                Losnummer = 2994
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 10,
                    Beschreibung = "Optik im Jaguarhaus, Heiligengeistwall 8, 26122 OL, Gutschein 100 €",
                    Losnummer = 2979
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 10,
                    Beschreibung = "Landessparkasse zu OL (LzO), Berliner Platz 1, 26123 OL, Gutschein für das OLisches Staatstheater 100 €",
                    Losnummer = 415
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 11,
                    Beschreibung = "Brillen Hess, Hauptstraße 61, 26122 OL, Brillengutschein 100 €",
                    Losnummer = 4622
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 11,
                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, Brombeerweg 55, 26180 Rastede, Gutschein Uhren, Schmuck Pareigat 150 €",
                    Losnummer = 6089
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 11,
                Beschreibung = "Dr. Bönkhoff und Gilbers mbB, Hauptstraße 35, 26122 OL, OLgutschein 100 €",
                Losnummer = 2528
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 12,
                Beschreibung = "Hankens Flora Apotheke, Bahnhofstraße 15, 26209 Hatten, Einkaufsgutschein 100 €",
                Losnummer = 25
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 12,
                    Beschreibung = "Barometer M-Verlag, Raiffeisenstr. 25, 26122 OL, 2xDas Barometer (Buch/App) je 50 €",
                    Losnummer = 5629
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 12,
                    Beschreibung = "Bäckerei Janssen, Scharreler Damm 11, 26188 Edewecht, Geschenkgutschein 100 €",
                    Losnummer = 3842
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 13,
                    Beschreibung = "Florian Isensee GmbH, Haarenstraße 20, 26122 OL, Einkaufsgutschein 100 €",
                    Losnummer = 6583
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 13,
                    Beschreibung = "GVO Versicherung, GVO Platz, 26160 Bad Zwischenahn, Gutscheine für das Hotel 53 Grad - Bad Zwischenahn 100 €",
                    Losnummer = 6725
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 13,
                    Beschreibung = "GVO Versicherung, GVO Platz, 26160 Bad Zwischenahn, 2 Gutscheine Rundfahrt und Frühstück auf dem Zwischenahner Meer 100 €",
                    Losnummer = 4337
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 14,
                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, Brombeerweg 55, 26180 Rastede, Einkaufsgutscheine für Rasteder Geschäfte 150 €",
                    Losnummer = 3566
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 14,
                    Beschreibung = "GVO Versicherung, GVO Platz, 26160 Bad Zwischenahn, 2 Gutscheine für das Restaurant Ahrenshof je 50 €",
                    Losnummer = 263
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 14,
                    Beschreibung = "Neotaste GmbH, Saarbrücker Str. 37 AB, 10405 Berlin, 2x12 Monate Geschenkbox je 50 €",
                    Losnummer = 5563
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 15,
                    Beschreibung = "Hankens Alexander Apotheke, Alexanderstraße 125,  26121 OL, Einkaufsgutschein 100 €",
                    Losnummer = 2597
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 15,
                    Beschreibung = "OLisches Staatstheater, Theaterwall 28, 26122 OL, Theatergutscheine 150 € ",
                    Losnummer = 6753
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 15,
                    Beschreibung = "Löschau, Melkbrink 15, 26121 OL, Einkaufsgutschein 100 €",
                    Losnummer = 3657
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 16,
                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, Haarenufer 31, 26122 OL, Gutschein 100 €",
                    Losnummer = 5964
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 16,
                    Beschreibung = "Tecis Finanzdienstleistungen AG, Cloppenburger Straße 3, 26135 OL, Gutschein 100 €",
                    Losnummer = 4678
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 16,
                    Beschreibung = "Hankens Haaren Apotheke , Haarenstraße 38, 26122 OL, Einkaufsgutschein 100 €",
                    Losnummer = 1483
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 17,
                    Beschreibung = "Park der Gärten gGmbH, Elmendorfer Str.40, 26160 Bad Zwischenahn, 2 Jahreskarten",
                    Losnummer = 2726
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 17,
                    Beschreibung = "Landessparkasse zu OL (LzO), Berliner Platz 1, 26123 OL, Gutschein für das OLische Staatstheater 100 €",
                    Losnummer = 4597
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 17,
                    Beschreibung = "La Vista Das Brillen Atelier, Gaststraße. 28, 26122 OL, Gutschein 150 €",
                    Losnummer = 59
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 18,
                    Beschreibung = "Beauty Concept by Stefanie Junghans, Donnerschweerstr. 57, 26123 OL, Gutschein Kosmetik 150 €",
                    Losnummer = 1066
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 18,
                    Beschreibung = "Hankens Hansa Apotheke, Alter Postweg 125, 26133 OL, Einkaufsgutschein 100 €",
                    Losnummer = 1678
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 18,
                    Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 OL, 2 Gutscheine für Fotobuch je 50 €",
                    Losnummer = 666
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 19,
                    Beschreibung = "Vorwerk Gartenwelt, OLer Str. 100, 26180 Rastede, Einkaufsgutschein 100 €",
                    Losnummer = 2244
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 19,
                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, Haarenufer 31, 26122 OL, Gutschein 100 €",
                    Losnummer = 5148
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 19,
                    Beschreibung = "GSG Bau- und Wohngesellschaft, Straßburger Str. 8, 26123 OL, 5 Theatergutscheine für Theater Laboratorium je 25 €",
                    Losnummer = 1594
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 20,
                    Beschreibung = "Ev. Familien-Bildungsstätte OL, Haareneschstraße 58a, 26121 OL, Kurse bei der Ev. Familien-Bildungsstätte OL 150 €",
                    Losnummer = 2547
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 20,
                    Beschreibung = "Phönix Bar & Restaurant, Ehnernstraße 15, 26122 OL, Gutschein 150 €",
                    Losnummer = 207
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 20,
                    Beschreibung = "Status Organisationsgesellschaft mbH, Nadorster Straße 222, 26123 OL, Gutschein für Möbelhaus Buss 150 €",
                    Losnummer = 1983
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 21,
                    Beschreibung = "Optiker Schulz, Achternstraße 30/31, 26122 OL, Gutschein einmalig 50% Rabatt beim Kauf einer Brille ",
                    Losnummer = 4284
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 21,
                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, Brombeerweg 55, 26180 Rastede, Gutscheine für Restaurant Antalya 150 €",
                    Losnummer = 6034
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 21,
                    Beschreibung = "OLer Volksbank, Lange Straße 8/9, 26122 OL, Fondsanteile der Union Invest",
                    Losnummer = 4739
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 22,
                    Beschreibung = "Bettenhaus Uwe Heintzen GmbH, Hauptstraße 109, 26131 OL, Gutschein 250 €",
                    Losnummer = 1967
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 22,
                    Beschreibung = "Autohaus Frank Voigt, Bloherfelder Str. 242-244, 26129 OL, Gutschein im Wer von 200 €",
                    Losnummer = 4388
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 22,
                    Beschreibung = "Cassens GmbH&CoKG, Bremer Heerstraße 460, 26135 OL, 3 Einkaufsgutscheine je 50,- €",
                    Losnummer = 3799
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 23,
                    Beschreibung = "Hautnah , Herbartgang 13, 26122 OL, Gutschein 150 €",
                    Losnummer = 5423
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 23,
                    Beschreibung = "Eventhaus Müggenkrug, Elsflether Str. 53, 26125 OL, Gutschein 150 €",
                    Losnummer = 5487
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 23,
                    Beschreibung = "Christina Schulz, Galerie für Schmuck, Johannisstraße 15, 26121 OL, Gutschein 150 €",
                    Losnummer = 6064
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 24,
                    Beschreibung = "D'OR Galerie und Goldschmiede, Herbartgang 11, 26122 OL, Gutschein für ein Schmuckstück 300 €",
                    Losnummer = 3634
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 24,
                    Beschreibung = "Golfclub am Meer, Ebereschenstraße 10, 26160 Bad Zwischenahn, Platzerlaubnis incl. Prüfungsgebühr für 2 Pers.",
                    Losnummer = 109
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 24,
                    Beschreibung = "Volkswagen Zentrum OL, Bremer Heerstraße 1, 26135 OL, Fahrt mit einem VW ID in die Autostadt mit 1 ÜN für 2 Pers.",
                    Losnummer = 349
                }
           };

            // Save, just for fun...
            //gewinneService.Add(data);

            //var today = new DateTime(2025, 12, 24);
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

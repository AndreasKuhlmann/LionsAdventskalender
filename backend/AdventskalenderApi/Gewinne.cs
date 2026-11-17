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
                    Beschreibung = "Hankens Apotheke in den Höfen, Grüne Straße 10, 26121 Oldenburg, Gutschein 100€",
                    Losnummer = 3332
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, Haarenufer 31, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 2958
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 1,
                    Beschreibung = "Christina Schulz, Galerie für Schmuck, Johannisstraße 15, 26121 Oldenburg, Gutschein 150€",
                    Losnummer = 913
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Beschreibung = "bruns Männermode, Haarenstraße 57-60, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 3096
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Beschreibung = "Brillen Hess, Hauptstraße 61, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 4166
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 2,
                    Beschreibung = "Oldenburger Wohngarten, Stubbenweg 29, 26125 Oldenburg, Gutschein 100€",
                    Losnummer = 6174
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 Oldenburg, 2 Gutscheine für Fotobuch je 50€",
                    Losnummer = 1133
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Beschreibung = "GSG Bau- und Wohngesellschaft, Straßburger Str. 8, 26123 Oldenburg, 5 Gutscheine für Theater Laboratorium je 25€",
                    Losnummer = 6191
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 3,
                    Beschreibung = "Scharmann`s, Haarenstraße 58, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 5374
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Beschreibung = "Nölker & Nölker Teehandel, Mottenstraße 2, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 3405
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Beschreibung = "Krah, Rosemarie und Dieter, LC Oldenburg Lappan, 26180 Rastede, Bargeld 120€",
                    Losnummer = 4534
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 4,
                    Beschreibung = "Innenleben, Baumgartenstraße 4, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 122
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Beschreibung = "bruns Männermode Grosse Grössen, Haarenstraße 57-60, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 6253
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Beschreibung = "laufrausch, Hauptstraße 28, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 3850
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 5,
                    Beschreibung = "Marien-Apotheke, Marienstraße 1, 26121 Oldenburg, Gutschein 100€",
                    Losnummer = 2998
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Beschreibung = "Buchhandlung Hemmieoltmanns, Posthalterweg 10, 26129 Oldenburg, Buchgutschein 100€",
                    Losnummer = 4512
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Beschreibung = "Landessparkasse zu Oldenburg (LzO), Berliner Platz 1, 26123 Oldenburg, Gutscheine für das Oldenburgisches Staatstheater 200€",
                    Losnummer = 4173
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 6,
                    Beschreibung = "Onken, Lange Straße 62, 26122 Oldenburg, Gutschein 150€",
                    Losnummer = 2127
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 7,
                    Beschreibung = "Natalia Wellness Salon, Bremer Heerstraße 146, 26135 Oldenburg, 2 Gutscheine im Wert von je 50,-€",
                    Losnummer = 2323
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 7,
                    Beschreibung = "Landessparkasse zu Oldenburg (LzO), Berliner Platz 1, 26123 Oldenburg, Gutscheine für den theater hof 19, 100€",
                    Losnummer = 3266
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 7,
                    Beschreibung = "Eismanufaktur, Dragonerstraße 43, 26135 Oldenburg, 2 Gutscheine je 50€",
                    Losnummer = 1010
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 8,
                    Beschreibung = "Heinrich v. d. Pütten, Gerhard-Stalling-Straße 51, 26135 Oldenburg, Fensterreinigung 100€",
                    Losnummer = 1231
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 8,
                    Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 Oldenburg, 2 Gutscheine für Fotobuch je 50€",
                    Losnummer = 4030
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 8,
                    Beschreibung = "Sonnen-Apotheke, Eichenstraße 17, 26131 Oldenburg, Gutschein 100€",
                    Losnummer = 2169
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 9,
                    Beschreibung = "bruns Berufsmode, Posthalterweg 17, 26129 Oldenburg, Gutschein 100€",
                    Losnummer = 5346
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 9,
                    Beschreibung = "Köhn & Plambeck, An der Braker Bahn 22, 26122 Oldenburg, Tankgutschein, 100€",
                    Losnummer = 957
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 9,
                    Beschreibung = "TiTo. Manufaktur, Bergstr. 2, 26122 Oldenburg, Anfertigung eines Schmuckstückes, 100€",
                    Losnummer = 2396
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 10,
                    Beschreibung = "Corpus Sport-und Gesundheitszentrum, Giesenweg 19, 26133 Oldenburg, Ärztl. Beratung 1/4 Jahr physioth. Anleitung",
                    Losnummer = 1535
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 10,
                    Beschreibung = "Landessparkasse zu Oldenburg, Berliner Platz 1, 26123 Oldenburg, Gutschein für das OL-Staatstheater 100€",
                    Losnummer = 165
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 10,
                    Beschreibung = "Optik im Jaguarhaus, Heiligengeistwall 8, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 4602
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 11,
                    Beschreibung = "Brillen Hess, Hauptstraße 61, 26122 Oldenburg, Brillengutschein, 100€",
                    Losnummer = 6261
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 11,
                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, Brombeerweg 55, 26180 Rastede, Gutschein für Uhren, Schmuck Pareigat 150€",
                    Losnummer = 564
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 11,
                    Beschreibung = "Dr. Bönkhoff Gilbers und Dedden Partg mbB, Hauptstraße 35, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 3389
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 12,
                    Beschreibung = "Bäckerei Janssen, Scharreler Damm 11, 26188 Edewecht, Gutschein 100€",
                    Losnummer = 5857
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 12,
                    Beschreibung = "Barometer M-Verlag, Raiffeisenstr. 25, 26122 Oldenburg, 2xDas Barometer (Buch/App) je 50€",
                    Losnummer = 3176
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 12,
                    Beschreibung = "Hankens Flora Apotheke, Bahnhofstraße 15, 26209 Hatten, Gutschein 100€",
                    Losnummer = 5702
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 13,
                    Beschreibung = "Dogtown, Heiligengeistwall 2, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 5937
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 13,
                    Beschreibung = "Buchhandlung Hemmieoltmanns, Posthalterweg 10, 26129 Oldenburg, Gutschein 100€",
                    Losnummer = 1253
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 13,
                    Beschreibung = "Florian Isensee GmbH, Haarenstraße 20, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 1067
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 14,
                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, Brombeerweg 55, 26180 Rastede, Gutschein für Rasteder Geschäfte 150€",
                    Losnummer = 2888
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 14,
                    Beschreibung = "Dogtown, Heiligengeistwall 2, 26122 Oldenburg, 2 Gutschein je 100€",
                    Losnummer = 1441
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 14,
                    Beschreibung = "Neotaste GmbH, Saarbrücker Str. 37 AB, 10405 Berlin, 3x 12 Monate Geschenkbox je 50€",
                    Losnummer = 6206
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 15,
                    Beschreibung = "Hankens Alexander Apotheke, Alexanderstraße 125, 26121 Oldenburg, Gutschein 100€",
                    Losnummer = 4186
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 15,
                    Beschreibung = "Oldenburgisches Staatstheater, Theaterwall 28, 26122 Oldenburg, Gutschein, 150€",
                    Losnummer = 39
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 15,
                    Beschreibung = "Löschau, Melkbrink 15, 26121 Oldenburg, Gutschein 100€",
                    Losnummer = 3689
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 16,
                    Beschreibung = "Porzellan Brandes, Lange Straße 41, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 1955
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 16,
                    Beschreibung = "Hankens Haaren Apotheke, Haarenstraße 38, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 5706
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 16,
                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, Haarenufer 31, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 4294
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 17,
                    Beschreibung = "La Vista Das Brillen Atelier, Gaststraße. 28, 26122 Oldenburg, Gutschein 150€",
                    Losnummer = 5261
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 17,
                    Beschreibung = "Landessparkasse zu Oldenburg, Berliner Platz 1, 26123 Oldenburg, Gutschein für das OL-Staatstheater 100€",
                    Losnummer = 3715
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 17,
                    Beschreibung = "Park der Gärten gGmbH, Elmendorfer Str.40, 26160 Bad Zwischenahn, 2 Jahreskarten",
                    Losnummer = 5355
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 18,
                    Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 Oldenburg, 2 Gutscheine für Fotobuch je 50€",
                    Losnummer = 1949
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 18,
                    Beschreibung = "Hankens Hansa Apotheke, Alter Postweg 125, 26133 Oldenburg, Gutschein 100€",
                    Losnummer = 1401
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 18,
                    Beschreibung = "Beauty Concept by Stefanie Junghans, Donnerschweerstr. 57, 26123 Oldenburg, Gutschein 150€",
                    Losnummer = 3351
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 19,
                    Beschreibung = "Köhn & Plambeck, An der Braker Bahn 22, 26122 Oldenburg, Tankgutschein 100€",
                    Losnummer = 1370
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 19,
                    Beschreibung = "GSG Bau- und Wohngesellschaft, Straßburger Str. 8, 26123 Oldenburg, 5 Theatergutscheine für Theater Laboratorium je 25€",
                    Losnummer = 3200
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 19,
                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, Haarenufer 31, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 726
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 20,
                    Beschreibung = "Phönix Bar & Restaurant, Ehnernstraße 15, 26122 Oldenburg, Gutschein 150€",
                    Losnummer = 3240
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 20,
                    Beschreibung = "Ev. Familien-Bildungsstätte Oldenburg, Haareneschstraße 58a, 26121 Oldenburg, Kursgutschein 150€",
                    Losnummer = 5685
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 20,
                    Beschreibung = "Status Organisationsgesellschaft mbH, Nadorster Straße 222, 26123 Oldenburg, Gutschein für Möbelhaus Buss 150€",
                    Losnummer = 2563
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 21,
                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, Brombeerweg 55, 26180 Rastede, Gutscheine für Restaurant Antalya 150€",
                    Losnummer = 161
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 21,
                    Beschreibung = "Optiker Schulz, Achternstraße 30/31, 26122 Oldenburg, Gutschein 50% Rabatt beim Kauf einer Brille",
                    Losnummer = 6066
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 21,
                    Beschreibung = "Oldenburger Volksbank, Lange Straße 8/9, 26122 Oldenburg, Gutschein über die Erstellung eines Energieausweises",
                    Losnummer = 751
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 22,
                    Beschreibung = "Cassens GmbH&CoKG, Bremer Heerstraße 460, 26135 Oldenburg, 2 Gutscheine je 50€",
                    Losnummer = 3045
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 22,
                    Beschreibung = "Autohaus Frank Voigt, Bloherfelder Str. 242-244, 26129 Oldenburg, Gutschein 200€",
                    Losnummer = 34
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 22,
                    Beschreibung = "Golfclub am Meer, Ebereschenstraße 10, 26160 Bad Zwischenahn, Platzerlaubnis incl. Prüfungsgebühr für 2 Pers.",
                    Losnummer = 4831
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 23,
                    Beschreibung = "Bettenhaus Uwe Heintzen GmbH, Hauptstraße 109, 26131 Oldenburg, Gutschein 250€",
                    Losnummer = 5066
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 23,
                    Beschreibung = "Eventhaus Müggenkrug, Elsflether Str. 53, 26125 Oldenburg, Gutschein 150€",
                    Losnummer = 1618
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 23,
                    Beschreibung = "Hautnah, Herbartgang 13, 26122 Oldenburg, Gutschein 100€",
                    Losnummer = 3058
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 24,
                    Beschreibung = "VHS Oldenburg, Karlstraße 25, 26123 Oldenburg, Individuelles Kochevent",
                    Losnummer = 4116
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 24,
                    Beschreibung = "D'OR Galerie und Goldschmiede, Herbartgang 11, 26122 Oldenburg, Gutschein für ein Schmuckstück 300€",
                    Losnummer = 4895
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag = 24,
                    Beschreibung = "Volkswagen Zentrum Oldenburg, Bremer Heerstraße 1, 26135 Oldenburg, Fahrt mit einem VW ID in die Autostadt mit 1 ÜN für 2 Pers.",
                    Losnummer = 253
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

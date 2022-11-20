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
                    Tag= 1,
                    Beschreibung = "CEWE Stiftung & CO. KGaA, Meerweg 30 - 32, 26133 OL, Gutschein f�r Fotobuch, 100�",
                    Losnummer = 3122
                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 1,
                                    Beschreibung = "Marien-Apotheke, 26121 OL, Gutschein, 100�",
                                    Losnummer = 0208
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 1,
                                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, 26122 OL, Gutschein, 100�",
                                    Losnummer = 0514
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 2,
                                    Beschreibung = "Atlantis Reisen GmbH, 31515 Wunstorf, Reisegutschein, 100�",
                                    Losnummer = 5627
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 2,
                                    Beschreibung = "Brillen Hess, 26122 OL, Gutschein, 100�",
                                    Losnummer = 1847
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 2,
                                    Beschreibung = "OLer Wohngarten, 26125 OL, Gutschein, 100�",
                                    Losnummer = 5479
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 3,
                                    Beschreibung = "Michael Stephan - Photograph, 26135 OL, Fotoshooting, 100�",
                                    Losnummer = 3903
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 3,
                                    Beschreibung = "Onken, 26122 OL, Gutschein, 150�",
                                    Losnummer = 5742
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 3,
                                    Beschreibung = "Scharmann`s, 26122 OL, Gutschein, 100�",
                                    Losnummer = 5091
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 4,
                                    Beschreibung = "Buchhandlung Thye, 26122 OL, Gutschein, 150�",
                                    Losnummer = 3287
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 4,
                                    Beschreibung = "Hankens Flora Apotheke, 26209 Hatten, 1 Gutschein, 100�",
                                    Losnummer = 5174
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 4,
                                    Beschreibung = "Rosemarie und Dieter Krah, LC OL Lappan, Rastede, Bargeld, 120�",
                                    Losnummer = 4847
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 5,
                                    Beschreibung = "Hankens Alexander Apotheke, 26121 OL, Gutschein, 100�",
                                    Losnummer = 1512
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 5,
                                    Beschreibung = "Hankens Haaren Apotheke , 26122 OL, Gutschein, 100�",
                                    Losnummer = 3088
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 5,
                                    Beschreibung = "Landessparkasse zu OL (LzO), 26123 OL, 2 x Gutscheine OL Staatstheater, 200�",
                                    Losnummer = 0595
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 6,
                                    Beschreibung = "Beauty Concept by Stefanie Junghans, 26123 OL, Gutschein Kosmetik, 150�",
                                    Losnummer = 0709
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 6,
                                    Beschreibung = "Corpus Sport-und Gesundheitszentrum, 26133 OL, �rztl. Trainingsberatung 1/4 Jahr physioth. Anleitung",
                                    Losnummer = 6064
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 6,
                                    Beschreibung = "Park der G�rten gGmbH, 26160 Bad Zwischenahn, 2 Jahreskarten � 60�",
                                    Losnummer = 2636
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 7,
                                    Beschreibung = "Florian Isensee GmbH, 26122 OL, Gutschein, 100�",
                                    Losnummer = 5504
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 7,
                                    Beschreibung = "GVO Versicherung, 26160 Bad Zwischenahn, 2 Gutscheine f�r das Caf� Magdalena � 50�",
                                    Losnummer = 0274
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 7,
                                    Beschreibung = "Sonnen-Apotheke, 26131 OL, Gutschein, 100�",
                                    Losnummer = 2871
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 8,
                                    Beschreibung = "Atlantis Reisen GmbH, 31515 Wunstorf, 2 Reisegutscheine � 100,-�",
                                    Losnummer = 1543
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 8,
                                    Beschreibung = "bruns Berufsmoden, 26129 OL, Gutschein, 100�",
                                    Losnummer = 0968
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 8,
                                    Beschreibung = "Optik im Jaguarhaus, 26122 OL, Gutschein, 100�",
                                    Losnummer = 6422
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 9,
                                    Beschreibung = "Heinrich v. d. P�tten, 26135 OL, Fensterreinigung, 100�",
                                    Losnummer = 0779
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 9,
                                    Beschreibung = "Landessparkasse zu OL (LzO), 26123 OL, 2 x Gutscheine f�r OL Staatstheater, 200�",
                                    Losnummer = 1063
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 9,
                                    Beschreibung = "Optik am Haarenufer, Inh. Niko Bolle, 26122 OL, 2 Gutschein � 100,-�",
                                    Losnummer = 3024
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 10,
                                    Beschreibung = "Gemeinn�tzige Werkst�tten OL e. V., 2 x Gutscheine a` 50,-�",
                                    Losnummer = 5675
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 10,
                                    Beschreibung = "GVO Versicherung, 26160 Bad Zwischenahn, 2 Gutscheine Casablanca Kino � 50�",
                                    Losnummer = 1388
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 10,
                                    Beschreibung = "Landwirtschaftskammer Niedersachsen, 26121 OL, Genussbox Niedersachsen, 100�",
                                    Losnummer = 6314
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 11,
                                    Beschreibung = "Brillen Hess, 26122 OL, Gutschein, 100�",
                                    Losnummer = 2033
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 11,
                                    Beschreibung = "Ev. Zentrum f�r Bildung in der Pflege e.V., 26129 OL, 4 x Gutscheine f�r Theater Laboratorium � 25,-�",
                                    Losnummer = 1687
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 11,
                                    Beschreibung = "N�lker & N�lker Teehandel, 26122 OL, 1 X Gutschein � 100,-�",
                                    Losnummer = 4827
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 12,
                                    Beschreibung = "Bettenhaus Uwe Heintzen GmbH, 26131 OL, Gutschein, 250�",
                                    Losnummer = 0340
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 12,
                                    Beschreibung = "GSG Bau- und Wohngesellschaft, 26123 OL, Theatergutscheine f�r Staatstheater, 120�",
                                    Losnummer = 5284
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 12,
                                    Beschreibung = "Rehabilitationszentrum GmbH, 26133 OL, Sport�rztliche Untersuchung, 260�",
                                    Losnummer = 2492
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 13,
                                    Beschreibung = "altera hotel und Michael Schmitz Brasserie, 26122 OL, Gutschein, 100�",
                                    Losnummer = 0193
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 13,
                                    Beschreibung = "N�lker & N�lker Teehandel, 26122 OL, 1 X Gutschein � 100�",
                                    Losnummer = 2883
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 13,
                                    Beschreibung = "Tecis Finanzdienstleistungen AG, 26135 OL, 100� inkl. individuelle Finanzberatung, 100�",
                                    Losnummer = 1885
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 14,
                                    Beschreibung = "D'OR Galerie und Goldschmiede, Herbartgang 11, 26122 OL, Schmuckst�ck, 300�",
                                    Losnummer = 3110
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 14,
                                    Beschreibung = "OLisches Staatstheater, 26122 OL, 6 X Theatergutscheine � 25�",
                                    Losnummer = 3068
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 14,
                                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, 26180 Rastede, Gutschein f�r Rasteder Gesch�fte, 150�",
                                    Losnummer = 5531
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 15,
                                    Beschreibung = "GVO Versicherung, 26160 Bad Zwischenahn, 2 Gutschein f�r laufrausch � 50�",
                                    Losnummer = 2566
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 15,
                                    Beschreibung = "Hankens Apotheke in den H�fen, 26121 OL, Gutschein, 100�",
                                    Losnummer = 6453
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 15,
                                    Beschreibung = "Hankens Hansa Apotheke, 26133 OL, Gutschein, 100�",
                                    Losnummer = 2713
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 16,
                                    Beschreibung = "bruns M�nnermode, 26122 OL, Gutschein, 100�",
                                    Losnummer = 5998
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 16,
                                    Beschreibung = "Optiker Schulz, 26122 OL, Gutschein einmalig 50% Rabatt beim Kauf einer Brille ",
                                    Losnummer = 1361
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 16,
                                    Beschreibung = "Piano Rosenkranz, 26122 OL, 1x Klavierstimmen oder 1x Begutachtung oder 1x Klavierbank",
                                    Losnummer = 3885
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 17,
                                    Beschreibung = "bruns M�nnermode 'camel-active', 26122 OL, Gutschein, 100�",
                                    Losnummer = 4213
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 17,
                                    Beschreibung = "COMMERZIAL TREUHAND GmbH, 26125 OL, Gutschein f�r Schuhhaus Sch�tte, 150�",
                                    Losnummer = 0896
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 17,
                                    Beschreibung = "Vorwerk Gartenwelt, 26180 Rastede, Gutschein, 100�",
                                    Losnummer = 4653
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 18,
                                    Beschreibung = "GSG Bau- und Wohngesellschaft, 26123 OL, Theatergutscheine f�r das Oldb. Staatstheater, 120�",
                                    Losnummer = 4938
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 18,
                                    Beschreibung = "laufrausch, 26122 OL, Gutschein, 100�",
                                    Losnummer = 4250
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 18,
                                    Beschreibung = "Michael Stephan - Photograph, 26135 OL, Fotoshooting, 100�",
                                    Losnummer = 5734
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 19,
                                    Beschreibung = "CEWE Stiftung & CO. KGaA, 26133 OL, Gutschein f�r Fotobuch, 100�",
                                    Losnummer = 3442
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 19,
                                    Beschreibung = "Die Blumenbinder, 26122 OL, Gutschein, 100�",
                                    Losnummer = 1003
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 19,
                                    Beschreibung = "La Vista Das Brillen Atelier, 26122 OL, Gutschein, 150�",
                                    Losnummer = 5131
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 20,
                                    Beschreibung = "B�ckerei Janssen, 26188 Edewecht, Gutschein, 100�",
                                    Losnummer = 5572
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 20,
                                    Beschreibung = "Landessparkasse zu OL, 2 x Gutscheine f�r Theaterhof 19, 100�",
                                    Losnummer = 1892
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 20,
                                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, 26180 Rastede, Restaurantgutscheine f�r Antalya, 100�",
                                    Losnummer = 1960
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 21,
                                    Beschreibung = "Buch Brader, 26122 OL, Duorama Leuchtglobus",
                                    Losnummer = 5437
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 21,
                                    Beschreibung = "CEWE Stiftung & CO. KGaA, 26133 OL, Gutschein f�r Fotobuch, 100�",
                                    Losnummer = 2846
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 21,
                                    Beschreibung = "Schmidt, Lauterbach & Partner Steuerberater, 26180 Rastede, Gutschein f�r Uhren, Schmuck Pareigat, 150�",
                                    Losnummer = 4762
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 22,
                                    Beschreibung = "Autohaus Frank Voigt,26129 OL, Gutschein, 200�",
                                    Losnummer = 3157
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 22,
                                    Beschreibung = "Ev. Familien-Bildungsst�tte OL, 26121 OL, Kurse bei der Ev. Familien-Bildungsst�tte OL, 150�",
                                    Losnummer = 3248
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 22,
                                    Beschreibung = "OLer Volksbank, 26122 OL, Fondsanteile der Union Investment , 250�",
                                    Losnummer = 0813
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 23,
                                    Beschreibung = "Cassens GmbH&CoKG, 26135 OL, 3 Gutschein � 50,-�, 150�",
                                    Losnummer = 5276
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 23,
                                    Beschreibung = "Marieta und Dr. Geert Wiedemeyer, Wardenburg, Gutschein f�r greenling / Kleiner Garten  gro�e Liebe!, 289�",
                                    Losnummer = 2628
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 23,
                                    Beschreibung = "Plo� Europe GmbH , 22885 Barsb�ttel, hochwertiger Teak Deckchair mit Auflage",
                                    Losnummer = 2602
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 24,
                                    Beschreibung = "Christina Schulz, Galerie f�r Schmuck, 26121 OL, Gutschein f�r ein Schmuckst�ck, 150�",
                                    Losnummer = 5882
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 24,
                                    Beschreibung = "L�schau, 26121 OL, Gutschein, 100�",
                                    Losnummer = 0039
                                },
                new Gewinn
                                {
                                    Id = Guid.NewGuid(),
                                    Tag= 24,
                                    Beschreibung = "Volkswagen Zentrum OL, 26135 OL, Fahrt mit einem VW ID in die Autostadt mit 1 �N f�r 2 Pers.",
                                    Losnummer = 2439
                                }
            };

            // Save, just for fun...
            gewinneService.Add(data);

            var today = DateTime.Today;

            int dayOfDecember = today.Month == 12 ? today.Day : (today.Month > 0 && today.Month < 11 ? 24 : 0);
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

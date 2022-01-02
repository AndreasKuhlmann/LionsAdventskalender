using System;
using System.Linq;
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
                    Tag=1,
                    Beschreibung="Juwelier Aurum, 26122 OL, Gutschein f�r ein Schmuckst�ck, 250�",
                    Losnummer = 5043
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung = "Optik am Haarenufer, 26122 OL  Gutscheine � 100�",
                    Losnummer = 5661
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung="Florian Isensee GmbH, 26122 OL, Gutschein, 100�",
                    Losnummer = 1259
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="L�schau Oldenburger Wohngarten, 26125 OL, Gutschein, 100�",
                    Losnummer = 2756
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="K�hn & Plambeck, 26122 OL, Tankgutschein, 100�",
                    Losnummer = 2151
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="Brillen Hess, 26122 OL, Gutschein, 100�",
                    Losnummer = 4845,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=3, Beschreibung="Optik im Jaguarhaus, 26122 OL, Gutschein, 100�",
                    Losnummer=2605
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=3, Beschreibung="Humanitas Ambulante Krankenpflege, 26129 OL, Bargutschein , 100�",
                    Losnummer=2357
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=3, Beschreibung="Onken, 26122 OL, Gutschein, 150�, Gunda",
                    Losnummer=1256
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=4, Beschreibung="Ressel-Haus GmbH, 26123 OL, Geschenkkarte Amazon, 100�",
                    Losnummer=166
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=4, Beschreibung="GVO Versicherung, 26122 OL, 2 Gutscheine f�rs Casablanca Kino � 50�",
                    Losnummer=1177
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=4, Beschreibung="Buchhandlung Thye, 26122 OL, Gutschein, 100�",
                    Losnummer=5684

                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=5, Beschreibung="Landessparkasse zu Oldenburg (LzO), 26123 OL, 1 x Wahlabo Schauspiel OLer Staatstheater",
                    Losnummer=4351

                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=5, Beschreibung="Hankens Haaren Apotheke, 26122 OL, Gutschein, 100�",
                    Losnummer=2535

                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=5, Beschreibung="Hankens Alexander Apotheke, 26121 OL, Gutschein, 100�",
                    Losnummer=5004

                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=6, Beschreibung="Beauty Concept by Stefanie Junghans, 26123 OL, Gutschein Kosmetik, 150�",
                    Losnummer=2847
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6, Beschreibung="L�schau, 26121 OL, Gutschein, 100�",
                    Losnummer=262
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Buch Brader, 26122 OL, Duorama Leuchtglobus",
                    Losnummer=2075
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Marien-Apotheke, 26121 OL, Gutschein, 100�",
                    Losnummer=2985
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Sonnen-Apotheke, 26131 OL, Gutschein, 100�",
                    Losnummer=2889
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="GVO Versicherung, 26122 OL, 2 Gutscheine f�r das Caf� Magdalena � 50�",
                    Losnummer=2114
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="bruns Berufsmoden, 26129 OL, Gutschein, 100�",
                    Losnummer=2840
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="Michael Stephan - Photograph, 26135 OL, Fotoshooting, 100�",
                    Losnummer=2977
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="Scharmann`s, 26122 OL, Gutschein, 100�",
                    Losnummer=5302
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="Optik am Haarenufer, Inh. Niko Bolle, 26122 OL, Gutschein 100�",
                    Losnummer=2046

                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="GSG Bau- und Wohngesellschaft, 26123 OL, 3 Gutscheine (Oldb. Staatstheater) � 40�",
                    Losnummer=3053
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="Landessparkasse zu Oldenburg (LzO), 26123 OL, Wahlabo Schauspiel Oldb. Staatstheater",
                    Losnummer=5271
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="Dieter Krah, LC OL Lappan, Rastede, Bargeld, 120�",
                    Losnummer=4624
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="EV. Altenpflegeschule e.V. in OL, 26129 OL, 4 x Gutscheine von Theater Laboratorium � 25�",
                    Losnummer=736
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="Gemeinn�tzige Werkst�tten OL e. V., 26125 OL, 2 x Gutscheine � 50�",
                    Losnummer=2295
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Brillen Hess, 26122 OL, Gutschein, 100�",
                    Losnummer=4685
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="laufrausch, 26122 OL, Gutschein, 100�",
                    Losnummer=6283,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Landwirtschaftskammer Niedersachsen, 26121 OL, Genussbox Niedersachsen, 100�",
                    Losnummer=398
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=12, Beschreibung="Piano Rosenkranz,, 26122 OL, 1x Klavierstimmen oder 1x Begutachtung",
                    Losnummer=894
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=12, Beschreibung="GSG Bau- und Wohngesellschaft, 26123 OL, 3 Gutscheinen (Oldb. Staatstheater) � 40�",
                    Losnummer=1653
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=12, Beschreibung="Rehabilitationszentrum GmbH, 26133 OL, Sport�rztliche Untersuchung, 260�",
                    Losnummer=5178
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13, Beschreibung="N�lker & N�lker Teehandel, 26122 OL, Gutschein 150�",
                    Losnummer=1963
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=13, Beschreibung="Tecis Finanzdienstleistungen AG, 26135 OL, 100� inkl. Vorteilsberatung mit Geld-Einspar-Garantie!, 100�",
                    Losnummer=2819
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=13, Beschreibung="altera hotel und Michael Schmitz Brasserie, 26122 OL, Gutschein, 100�",
                    Losnummer=5739
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=14, Beschreibung="D'OR Galerie und Goldschmiede, 26122 OL, Schmuckst�ck, 300�",
                    Losnummer=3849
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=14, Beschreibung="Schmidt, Lauterbach & Partner Steuerberater, 26180 Rastede, 10 Gutscheine f�r Rasteder Gesch�fte, 150�",
                    Losnummer=930
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=14, Beschreibung="OLisches Staatstheater, 26122 OL, 6 X Gutscheine  � 25�, 150�",
                    Losnummer=973
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=15, Beschreibung="Hankens Apotheke in den H�fen, 26121 OL, Gutschein, 100�",
                    Losnummer=3931
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=15, Beschreibung="Hankens Hansa Apotheke, 26133 OL, Gutscheine, 100�",
                    Losnummer=5426
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=15, Beschreibung="GVO Versicherung, 26122 OL, 2 Gutscheine f�r laufrausch � 50�",
                    Losnummer=840
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=16, Beschreibung="bruns M�nnermode, 26122 OL, Gutschein, 100�",
                    Losnummer=4164
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=16, Beschreibung="Optiker Schulz, 26122 OL, Gutschein einmalig 50% Rabatt beim Kauf einer Brille",
                    Losnummer=2212
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=16, Beschreibung="Bettenhaus Uwe Heintzen GmbH, 26131 OL, Gutschein, 250�",
                    Losnummer=2011
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=17, Beschreibung="B�ckerei Janssen, 26188 Edewecht, Gutschein, 100�",
                    Losnummer=2683
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=17, Beschreibung="Vorwerk Gartenwelt, 26180 Rastede, Gutschein, 100�",
                    Losnummer=3601
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=17, Beschreibung="Ev. Familien-Bildungsst�tte OL, 26121 OL, Kurse bei der Ev. Familien-Bildungsst�tte OL, 150�",
                    Losnummer=1751
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=18, Beschreibung="Heinrich v. d. P�tten, 26135 OL, Fensterreinigung Privathaus, 100�",
                    Losnummer=710
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=18, Beschreibung="Michael Stephan - Photograph, 26135 OL, Fotoshooting, 100�",
                    Losnummer=3798
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=18, Beschreibung="N�lker & N�lker Teehandel, 26122 OL, Gutschein � 150�",
                    Losnummer=3832
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=19, Beschreibung="CEWE Stiftung & CO. KGaA, 26133 OL, Fotobuch, 100�",
                    Losnummer=1016
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=19, Beschreibung="La Vista Das Brillen Atelier, 26122 OL, Gutschein, 150�",
                    Losnummer=3069
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=19, Beschreibung="Plo� & Co. GmbH Gartenm�bel-Wohnm�bel, 22885 Barsb�ttel, hochwertiger Teak Deckchair mit Auflage",
                    Losnummer=488
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=20, Beschreibung="Klostersch�nke Hude, 27798 Hude, Gutschein, 100�",
                    Losnummer=2107

                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=20, Beschreibung="bruns M�nnermode \"camel-store\", 26122 OL, Gutschein, 100�",
                    Losnummer=5297
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=20, Beschreibung="Maritim proArte Hotel Berlin, 10117 Berlin, 2 �bernachtungen DZ f�r 2 Pers. und Fr�hst�ck",
                    Losnummer=3370
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=21, Beschreibung="Schmidt, Lauterbach & Partner Steuerberater, 26180 Rastede, Gutschein Uhren und Schmuck Pareigat, 150�",
                    Losnummer=3794
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=21, Beschreibung="CEWE Stiftung & CO. KGaA, 26133 OL, Fotobuch, 100�",
                    Losnummer=461
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=21, Beschreibung="Park der G�rten gGmbH, 26160 Bad Zwischenahn, 10 Tagskarten im Wert von � 12�",
                    Losnummer=5491
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=22, Beschreibung="Autohaus Frank Voigt, 26129 OL, Gutschein, 200�",
                    Losnummer=2729
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=22, Beschreibung="COMMERZIAL TREUHAND GmbH, 26125 OL, Gutschein Schuhhaus Sch�tte, 150�",
                    Losnummer=611
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=22, Beschreibung="Volksbank OL eG, 26122 OL, Fondsanteile der Union Investment, 250�",
                    Losnummer=5831
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=23, Beschreibung="Die Blumenbinder, 26122 OL, Gutschein, 100�",
                    Losnummer=1746
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=23, Beschreibung="Cassens GmbH&CoKG, 26135 OL, 3 Gutschein � 50�, 150�",
                    Losnummer=1202
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=23, Beschreibung="Schmidt, Lauterbach & Partner Steuerberater, 26180 Rastede, Gutschein Restaurant Antalya, 100�",
                    Losnummer=3913
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=24, Beschreibung="Corpus Sport-und Gesundheitszentrum, 26133 OL, �rztl. Trainingsberatung 1/4 Jahr physioth. Anleitung",
                    Losnummer=615
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=24, Beschreibung="VW Zentrum OL, 26135 OL, Fahrt mit einem VW E-Golf in die Autostadt mit 1 �N f�r 2 Pers.",
                    Losnummer=2714
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(), Tag=24, Beschreibung="CEWE Stiftung & CO. KGaA, 26133 OL, Fotobuch, 100�",
                    Losnummer=6473
                },
            };

            // Save, just for fun...
            gewinneService.Add(data);

            var today = DateTime.Today;
            var dayOfDecember = 24;
            if (today.Month == 12)
                dayOfDecember = today.Day;

            data.ToList().ForEach(d =>
            {
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

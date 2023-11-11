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
                    Tag=1,
                    Beschreibung="CEWE Stiftung & CO. KGaA,Meerweg 30-32,26133 OL,2 Gutscheine f�r Fotobuch � 50 �,100 �",
                    Losnummer=6431,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung="Heinrich v. d. P�tten,Gerhard-Stalling-Stra�e 51,26135 OL,Glasreinigung,100 �",
                    Losnummer=2493,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=1,
                    Beschreibung="Marien-Apotheke,Marienstra�e 1,26121 OL,Gutschein,100 �",
                    Losnummer=2674,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="Brillen Hess,Hauptstra�e 61,26122 OL,Gutschein,100 �",
                    Losnummer=2489,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="OLer Wohngarten,Stubbenweg 29,26125 OL,Gutschein,100 �",
                    Losnummer=4682,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=2,
                    Beschreibung="Optik am Haarenufer,Inh. Niko Bolle,Haarenufer 31,26122 OL,Gutschein,100 �",
                    Losnummer=5092,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=3,
                    Beschreibung="Beauty Concept by Stefanie Junghans,Donnerschweerstr. 57,26123 OL,Gutschein Kosmetik,150 �",
                    Losnummer=3777,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=3,
                    Beschreibung="Michael Stephan-Photograph,Haubentaucherring 13a,26135 OL,Fotoshooting,100 �",
                    Losnummer=1220,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=3,
                    Beschreibung="Scharmann`s,Haarenstra�e 58,26122 OL,Gutschein,100 �",
                    Losnummer=243,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=4,
                    Beschreibung="CEWE Stiftung & CO. KGaA,Meerweg 30-32,26133 OL,2 Gutscheine f�r Fotobuch � 50 �,100 �",
                    Losnummer=4906,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=4,
                    Beschreibung="Hankens Flora Apotheke,Bahnhofstra�e 15,26209 Hatten,Gutschein,100 �",
                    Losnummer=6444,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=4,
                    Beschreibung="Optik im Jaguarhaus,Heiligengeistwall 8,26122 OL,Gutschein,100 �",
                    Losnummer=527,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=5,
                    Beschreibung="Hankens Alexander Apotheke,Alexanderstra�e 125, 26121 OL,Gutschein,100 �",
                    Losnummer=6320,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=5,
                    Beschreibung="Hankens Haaren Apotheke,Haarenstra�e 38,26122 OL,Gutschein,100 �",
                    Losnummer=6066,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=5,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,Gutscheine f�r OLisches Staatstheater,100 �",
                    Losnummer=3461,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Gemeinn�tzige Werkst�tten OL e. V.,Rennplatzstra�e  203,26125 OL,2 x Gutscheine a` 50,- �,100 �",
                    Losnummer=1796,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Onken,Lange Stra�e 62,26122 OL,Gutschein,150 �",
                    Losnummer=1331,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=6,
                    Beschreibung="Park der G�rten gGmbH,Elmendorfer Str.40,26160 Bad Zwischenahn,2 Jahreskarten � 60 �,120 �",
                    Losnummer=35,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="GVO Versicherung,GVO Platz,26160 Bad Zwischenahn,2 Gutscheine f�r das Caf� Magdalena � 50 �,100 �",
                    Losnummer=5734,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Optiker Schulz,Achternstra�e 30/31,26122 OL,Gutschein einmalig 50% Rabatt beim Kauf einer Brille",
                    Losnummer=5717,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=7,
                    Beschreibung="Sonnen-Apotheke,Eichenstra�e 17,26131 OL,Gutschein,100 �",
                    Losnummer=41,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="COMMERZIAL TREUHAND GmbH,Wilhelmsh.-Heerstra�e 79,26125 OL,Gutschein f�r Schuhhaus Sch�tte,150 �",
                    Losnummer=2398,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="Die Blumenbinder,Herbartgang 25,26122 OL,Gutschein,100 �",
                    Losnummer=2145,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=8,
                    Beschreibung="TiTo. Manufaktur,Bergstr. 2,26122 OL,Gutschein,150 �",
                    Losnummer=3262,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="Klostersch�nke Hude,Von-Witzleben-Allee 3,27798 Hude,Gutschein,100 �",
                    Losnummer=3238,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,Gutscheine f�r das OLisches Staatstheater,150 �",
                    Losnummer=4261,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=9,
                    Beschreibung="Optik am Haarenufer,Inh. Niko Bolle,Haarenufer 31,26122 OL,Gutschein,100 �",
                    Losnummer=179,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="Corpus Sport-und Gesundheitszentrum,Giesenweg 19,26133 OL,�rztl. Trainingsberatung 1/4 Jahr physioth. Anleitung",
                    Losnummer=5139,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="GVO Versicherung,GVO Platz,26160 Bad Zwischenahn,2 Gutscheine f�r das Casablanca Kino � 50 �,100 �",
                    Losnummer=1858,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=10,
                    Beschreibung="N�lker & N�lker Teehandel,Mottenstra�e 2,26122 OL,1 X Gutschein � 100,- �,100 �",
                    Losnummer=1080,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Brillen Hess,Hauptstra�e 61,26122 OL,Gutschein,100 �",
                    Losnummer=4023,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="Ev. Zentrum f�r Bildung in der Pflege e.V.,Artillerieweg 37,26129 OL,4 x Gutscheine f�r das Theater Laboratorium  je 25,- �,100 �",
                    Losnummer=2469,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=11,
                    Beschreibung="N�lker & N�lker Teehandel,Mottenstra�e 2,26122 OL,1 X Gutschein � 100,- �,100 �",
                    Losnummer=1163,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=12,
                    Beschreibung="Bettenhaus Uwe Heintzen GmbH,Hauptstra�e 109,26131 OL,Gutschein,250 �",
                    Losnummer=5143,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=12,
                    Beschreibung="GSG Bau- und Wohngesellschaft,Stra�burger Stra�e 8,26123 OL,Gutscheine f�r das Oldb. Staatstheater,120 �",
                    Losnummer=2141,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=12,
                    Beschreibung="Rehabilitationszentrum GmbH,Brandenburger Stra�e 31,26133 OL,Sport�rztliche Untersuchung,260 �",
                    Losnummer=1214,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13,
                    Beschreibung="Buch Brader,Haarenstra�e 8,26122 OL,1 X B�chergutscheine � 150 �,150 �",
                    Losnummer=948,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13,
                    Beschreibung="Tecis Finanzdienstleistungen AG,Cloppenburger Stra�e 3,26135 OL,Gutschein,100 �",
                    Losnummer=5494,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=13,
                    Beschreibung="Wachsst�bchen,Alexanderstra�e 1, 26121 OL,5 X Gutscheine � 30 � f�r Haarentfernung und Fu�pflege,150 �",
                    Losnummer=4483,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=14,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,Gutscheine f�r das OLisches Staatstheater,150 �",
                    Losnummer=459,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=14,
                    Beschreibung="laufrausch,Hauptstra�e 28,26122 OL,Gutschein,100 �",
                    Losnummer=2187,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=14,
                    Beschreibung="Schmidt,Lauterbach & Partner Steuerberater,Brombeerweg 55,26180 Rastede,Gutscheine f�r Rasteder Gesch�fte,150 �",
                    Losnummer=4420,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=15,
                    Beschreibung="GVO Versicherung,GVO Platz,26160 Bad Zwischenahn,2 Gutscheine f�r laufrausch � 50 �,100 �",
                    Losnummer=4679,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=15,
                    Beschreibung="Hankens Apotheke in den H�fen,Gr�ne Stra�e 10,26121 OL,Gutschein,100 �",
                    Losnummer=3554,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=15,
                    Beschreibung="Hankens Hansa Apotheke,Alter Postweg 125,26133 OL,Gutschein,100 �",
                    Losnummer=3619,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=16,
                    Beschreibung="bruns M�nnermode,Haarenstra�e 57-60,26122 OL,Gutschein,100 �",
                    Losnummer=258,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=16,
                    Beschreibung="Florian Isensee GmbH,Haarenstra�e 20,26122 OL,Gutschein,100 �",
                    Losnummer=3667,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=16,
                    Beschreibung="Piano Rosenkranz,Mottenstra�e 8-9,26122 OL,Tastenschnuppperkurs,140 �",
                    Losnummer=6420,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=17,
                    Beschreibung="B�ckerei Janssen,Scharreler Damm 11,26188 Edewecht,Geschenkgutschein,100 �",
                    Losnummer=3891,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=17,
                    Beschreibung="Hautnah,Herbartgang 13,26122 OL,Warengutschein,150 �",
                    Losnummer=2400,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=17,
                    Beschreibung="Vorwerk Gartenwelt,OLer Str. 100,26180 Rastede,Gutschein,100 �",
                    Losnummer=3746,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=18,
                    Beschreibung="GSG Bau- und Wohngesellschaft,Stra�burger Str. 8,26123 OL,Gutscheine f�r das Oldb. Staatstheater,120 �",
                    Losnummer=6273,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=18,
                    Beschreibung="Michael Stephan-Photograph,Haubentaucherring 13a,26135 OL,Fotoshooting,100 �",
                    Losnummer=5187,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=18,
                    Beschreibung="OLisches Staatstheater,Theaterwall 28,26122 OL,Gutscheine,150 �",
                    Losnummer=2888,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=19,
                    Beschreibung="Autohaus Frank Voigt,Bloherfelder Str. 242-244,26129 OL,Gutschein,200 �",
                    Losnummer=4452,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=19,
                    Beschreibung="bruns Berufsmode,Posthalterweg 17,26129 OL,Gutschein,100 �",
                    Losnummer=5792,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=19,
                    Beschreibung="Rosemarie und Dieter Krah,LC OL Lappan,26180 Rastede,Bargeld,120 �",
                    Losnummer=1798,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=20,
                    Beschreibung="bruns M�nnermode Grosse Gr�ssen,Haarenstra�e 57-60,26122 OL,Gutschein,100 �",
                    Losnummer=5097,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=20,
                    Beschreibung="Landessparkasse zu OL (LzO),Berliner Platz 1,26123 OL,2 x Gutscheine f�r Theaterhof 19,100 �",
                    Losnummer=639,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=20,
                    Beschreibung="Schmidt,Lauterbach & Partner Steuerberater,Brombeerweg 55,26180 Rastede,Gutscheine f�r Restaurant Antalya,100 �",
                    Losnummer=4787,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=21,
                    Beschreibung="Buch Brader,Mars-la-Tour-Stra�e 1-13,26121 OL,1 X B�chergutscheine � 150 �,150 �",
                    Losnummer=2057,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=21,
                    Beschreibung="CEWE Stiftung & CO. KGaA,Meerweg 30-32,26133 OL,2 Gutscheine f�r Fotobuch � 50 �,100 �",
                    Losnummer=5757,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=21,
                    Beschreibung="Schmidt,Lauterbach & Partner Steuerberater,Brombeerweg 55,26180 Rastede,Gutschein f�r Uhren,Schmuck Pareigat,150 �",
                    Losnummer=3897,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=22,
                    Beschreibung="Ev. Familien-Bildungsst�tte OL,Haareneschstra�e 58a,26121 OL,Kurse bei der Ev. Familien-Bildungsst�tte OL,150 �",
                    Losnummer=98,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=22,
                    Beschreibung="La Vista Das Brillen Atelier,Gaststra�e. 28,26122 OL,Gutschein,150 �",
                    Losnummer=461,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=22,
                    Beschreibung="L�schau,Melkbrink 15,26121 OL,Gutschein,100 �",
                    Losnummer=3949,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=23,
                    Beschreibung="Cassens GmbH&CoKG,Bremer Heerstra�e 460,26135 OL,3 Gutschein � 50,- �,150 �",
                    Losnummer=4892,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=23,
                    Beschreibung="D'OR Galerie und Goldschmiede,Herbartgang 11,26122 OL,Schmuckst�ck,300 �",
                    Losnummer=5725,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=23,
                    Beschreibung="Marieta und Dr. Geert Wiedemeyer,Wardenburg,Gutschein f�r greenling / Kleiner Garten  gro�e Liebe!,198 �",
                    Losnummer=3187,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=24,
                    Beschreibung="Christina Schulz,Galerie f�r Schmuck,Johannisstra�e 15,26121 OL,Gutschein f�r ein Schmuckst�ck,150 �",
                    Losnummer=2096,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=24,
                    Beschreibung="OLer Volksbank,Lange Stra�e 8-9,26122 OL,Fondsanteile der Union Investment,250 �",
                    Losnummer=143,
                },
                new Gewinn
                {
                    Id = Guid.NewGuid(),
                    Tag=24,
                    Beschreibung="Volkswagen Zentrum OL,Bremer Heerstra�e 1,26135 OL,Fahrt mit einem VW ID in die Autostadt mit 1 �N f�r 2 Pers.",
                    Losnummer=846,
                },
            };

            // Save, just for fun...
            gewinneService.Add(data);

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

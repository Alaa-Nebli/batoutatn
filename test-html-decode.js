// Test script to verify HTML entity decoding

const decodeHtmlEntities = (text = '') => {
  if (typeof document !== 'undefined') {
    // Browser environment - use DOM to decode entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  } else {
    // Server environment - manual entity decoding
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&hellip;/g, '...')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–');
  }
};

const stripHtml = (html = '') => {
  // First remove HTML tags, then decode entities, then clean up whitespace
  const withoutTags = html.replace(/<[^>]+>/g, '');
  const decodedEntities = decodeHtmlEntities(withoutTags);
  return decodedEntities
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .trim();
};

// Test with the sample text from the user's issue
const testText = `Petit déjeuner à l'hôtel.&nbsp;Confiez votre valise avant 9h00 à la réception de l'hôtel. Nous nous
occuperons de son transfert jusqu'à l'aéroport de Tokyo.Veuillez également prévoir un petit sac pour votre
dernière nuitée à Kyoto&nbsp;Commencez la journée par la visite du foret de bambou d'Arashiyama&nbsp;;
célèbre pour ses allées bordées de bambous géants qui s'élèvent vers le ciel. La lumière filtrant à travers les
bambous crée une atmosphère sereine et presque magique. Continuez avec la visite de la ville de Nara, la
plus ancienne capitale du Japon (par bus privé). Vous aurez l'opportunité de découvrir le majestueux Temple
TMdai-ji, l'un des sites les plus emblématiques de Nara et classé au patrimoine mondial de l'UNESCO. Ce
temple bouddhiste abrite le Grand Bouddha dente d'une hauteur de plus de 15 mètres, symbole de paix et de spiritualité.Vous allez également
croiser les célèbres daims de Nara évoluant librement avec les visiteurs. Ces daims sont considérés dans la
tradition shintoïste comme des messagers divins.Déjeuner libreContinuation vers Osaka avec une immersion
dans le quartier animé de Dotonbori&nbsp;; célèbre pour ses enseignes lumineuses, ses canaux, et son
ambiance vibrante. Une balade inoubliable à travers ses ruellespleines de vie, ses restaurants typiques, et
ses boutiques variées, cœur battant de la culture urbaine japonaise.Retour à Kyoto pour Nuitée à hôtel Kyoto
Shin-Hankyu&nbsp;Rendez-vous de tout le groupe à la réception de l'hôtel pour se rendre à un dîner
Japonais (inclus)`;

const cleanedText = stripHtml(testText);

console.log('Original text:');
console.log(testText);
console.log('\n' + '='.repeat(50) + '\n');
console.log('Cleaned text:');
console.log(cleanedText);

// Test with more complex HTML entities
const complexTest = `Prix du forfait :Par personne en Chambre
Double&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14.600 T
ND&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Supplément single&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&n
bsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.600
TNDSupplément Business Class : A vérifier au moment d'achat &amp; paiement&nbsp;`;

const cleanedComplexTest = stripHtml(complexTest);

console.log('\n' + '='.repeat(50) + '\n');
console.log('Complex test original:');
console.log(complexTest);
console.log('\n' + '='.repeat(50) + '\n');
console.log('Complex test cleaned:');
console.log(cleanedComplexTest);
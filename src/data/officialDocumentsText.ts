export interface OfficialDocSection {
  heading: string;
  paragraphs: string[];
}

export interface OfficialDocContent {
  title: string;
  subtitle: string;
  sections: OfficialDocSection[];
}

export const OFFICIAL_DOCUMENTS_TEXT: Record<string, OfficialDocContent> = {
  'doc-estatuts': {
    title: 'ESTATUTS DE L’ASSOCIACIÓ VILA JOCS',
    subtitle: 'Cambrils, 7 de febrer de 2026',
    sections: [
      {
        heading: 'CAPÍTOL I · La denominació, els fins i el domicili',
        paragraphs: [
          'Article 1. L’Associació VILA JOCS regula les seves activitats d’acord amb el que estableix la Llei 4/2008, de 24 d’abril, del llibre tercer del Codi civil de Catalunya, relatiu a les persones jurídiques; la Llei orgànica 1/2002, de 22 de març, reguladora del dret d’associació, i els seus estatuts.',
          'Article 2. Els fins de l’associació són: proveir amb mitjans i infraestructures dins l’àmbit del municipi de Cambrils i municipis propers als grups i a les persones interessades en realitzar activitats d’entreteniment alternatiu (jocs de taula, jocs d’estratègia, jocs de cartes col·leccionables i altres activitats d’oci lúdic i cultural); promoure tot tipus d’activitats culturals relacionades; i donar a conèixer els entreteniments alternatius a totes les persones interessades.',
          'Per aconseguir les seves finalitats, l’associació organitza periòdicament partides de jocs de taula, jocs d’estratègia i cartes col·leccionables (sense ànim de lucre), jornades lúdiques i tornejos oficials i no oficials a nivell local, provincial i nacional.',
          'Article 3. El domicili de l’associació s’estableix al Centre Cívic Les Basses, carrer Sant Pere, núm. 32, de Cambrils (CP: 43850). Les funcions d’aquesta associació s’exerceixen majoritàriament a Catalunya.',
        ],
      },
      {
        heading: 'CAPÍTOL II · Els membres de l’associació, els seus drets i les seves obligacions',
        paragraphs: [
          'Article 4. Poden formar part de l’associació totes les persones físiques i jurídiques que, de manera lliure i voluntària, tinguin interès en les seves finalitats. Les persones físiques han de tenir capacitat d’obrar; els menors d’entre 14 i 18 anys no emancipats necessiten consentiment dels pares o tutors per ser socis de ple dret (sense poder ser elegits a la Junta Directiva), i els menors de 14 anys exerceixen els drets per mitjà dels seus representants legals. Cal presentar sol·licitud per escrit a la Junta Directiva.',
          'Article 5. Són drets dels membres: assistir amb veu i vot a l’Assemblea General; elegir o ser elegits per als càrrecs de representació; intervenir en el govern i les activitats; exposar propostes; sol·licitar explicacions sobre la gestió; ser escoltats abans de mesures disciplinàries; rebre informació; fer ús dels serveis comuns, infraestructures i materials; formar part dels grups de treball; posseir un exemplar dels estatuts i consultar els llibres de l’associació.',
          'Article 6. Són deures dels membres: comprometre’s amb les finalitats de l’associació; contribuir al sosteniment amb el pagament de quotes i derrames; complir les obligacions estatutàries i els acords vàlidament adoptats; sotmetre a mediació les controvèrsies; tenir cura i fer un bon ús de les infraestructures i materials; i respectar la resta de membres.',
          'Article 7. Són causes de baixa: decisió pròpia comunicada per escrit a la Junta Directiva, no satisfer les quotes fixades o no complir les obligacions estatutàries o del reglament de règim intern.',
        ],
      },
      {
        heading: 'CAPÍTOL III · L’Assemblea General',
        paragraphs: [
          'Article 8. L’Assemblea General és l’òrgan sobirà de l’associació; tots els membres en formen part per dret propi i irrenunciable i queden subjectes als seus acords.',
          'Article 9. Facultats de l’Assemblea General: aprovar la gestió, el pressupost i els comptes anuals; elegir i separar l’òrgan de govern; modificar els estatuts; acordar quotes i contribucions; acordar transformació, fusió, escissió o dissolució; acordar ingrés o baixa en federacions; sol·licitar utilitat pública; aprovar el reglament de règim intern; conèixer sol·licituds d’ingrés, altes i baixes; i ratificar sancions per faltes molt greus.',
          'Article 10. L’Assemblea General ordinària es reuneix com a mínim un cop l’any dins dels sis mesos següents al tancament de l’exercici econòmic. Es pot convocar sessió extraordinària a iniciativa de l’òrgan de govern o quan ho sol·liciti un 10 % dels associats.',
          'Articles 11 i 12. Convocatòria amb un mínim de quinze dies d’antelació (incloent-hi videoconferència si es garanteix identificació i vot). Es constitueix vàlidament sigui quin sigui el nombre de socis presents o representats.',
          'Article 13. Correspon un vot a cada membre, delegable per escrit signat. Els acords generals es prenen per majoria simple; les modificacions estatutàries, dissolució, federació o disposició de béns requereixen majoria qualificada.',
        ],
      },
      {
        heading: 'CAPÍTOL IV · La Junta Directiva',
        paragraphs: [
          'Articles 14 i 15. La Junta Directiva regeix, administra i representa l’associació (president, vicepresident, secretari, tresorer i vocals, tots socis majors d’edat). Exerceixen el càrrec gratuïtament durant un període de cinc anys, amb possibilitat de reelecció.',
          'Article 16. Correspon a la Junta Directiva representar i administrar l’associació, proposar quotes, convocar assemblees, presentar balanços i pressupostos, organitzar grups de treball, gestionar locals o subvencions i resoldre provisionalment casos no previstos.',
          'Articles 17 a 20. Es reuneix com a mínim un cop cada trimestre (convocatòria ordinària o extraordinària a petició d’un terç dels membres). Quòrum de la meitat més un dels membres i acords per majoria simple consignats al llibre d’actes.',
        ],
      },
      {
        heading: 'CAPÍTOLS V, VI i VII · Presidència, Tresoreria, Secretaria i Grups de Treball',
        paragraphs: [
          'Article 21 (Presidència). Dirigeix i representa legalment l’associació, presideix debats, emet vot de qualitat en empats, convoca reunions i visa actes i certificats.',
          'Article 22 (Tresoreria). Custodia i controla els recursos econòmics, elabora pressupostos i comptes, porta el llibre de caixa, signa rebuts i paga factures visades.',
          'Article 23 (Secretaria). Custodia la documentació, redacta i signa actes, autoritza certificats i porta el llibre de registre de socis.',
          'Article 24 (Comissions o grups de treball). Qualsevol grup de socis en pot plantejar la creació informant la Junta Directiva i presentant un informe mensual de les seves actuacions.',
        ],
      },
      {
        heading: 'CAPÍTOLS VIII, IX i X · Règim econòmic, disciplinari i dissolució',
        paragraphs: [
          'Articles 25 a 28. Els recursos provenen de quotes, subvencions, donacions i rendes del patrimoni. L’exercici econòmic tanca el 31 de desembre. Per disposar dels fons bancaris calen dues signatures (una del tresorer o del president).',
          'Article 29 (Règim disciplinari). Les infraccions poden ser lleus, greus o molt greus, des d’amonestació fins a expulsió, mitjançant expedient amb audiència prèvia (10 dies per nomenar instructor, 15 dies per proposar resolució i 15 dies per resoldre).',
          'Articles 30 i 31 (Dissolució). Acordada per Assemblea General extraordinària. El romanent net de la liquidació s’ha de lliurar a una entitat pública o privada sense afany de lucre d’àmbit territorial amb finalitats benèfiques.',
        ],
      },
    ],
  },
  'doc-reglament': {
    title: 'REGLAMENT DE RÈGIM INTERN DE L’ASSOCIACIÓ VILA JOCS',
    subtitle: 'Normativa interna de funcionament, quotes i convivència',
    sections: [
      {
        heading: '1 i 2. Organització interna i organigrama bàsic',
        paragraphs: [
          '1.1–1.4. El Reglament de Règim Intern desenvolupa els Estatuts i fixa procediments de compliment obligat per a tots els membres de VILA JOCS.',
          '2.1–2.4. L’Assemblea General escull la Junta Directiva (formada com a mínim per Presidència, Secretariat i Tresoreria, i opcionalment Vice-presidència i Vocals). Les comunicacions oficials es fan per correu electrònic i a través del grup de WhatsApp oficial, informant de dies, horaris i partides previstes.',
        ],
      },
      {
        heading: '3. L’Assemblea General',
        paragraphs: [
          '3.1–3.6. Tots els membres de ple dret hi assisteixen amb dret de vot presencial o delegat (a favor, en contra, en blanc o abstenció). Es pot convocar Assemblea Extraordinària amb les signatures del 20 % dels socis, i revocar la Junta Directiva amb el vot de 2/3 dels socis i sòcies.',
        ],
      },
      {
        heading: '4 i 5. La Junta Directiva i els Grups de Treball',
        paragraphs: [
          '4.1–4.12. La Junta Directiva s’escull cada 5 anys entre socis fundadors o socis de ple dret amb més d’un any d’antiguitat i al corrent de quota. Es convoca amb 7 dies d’antelació, organitza les jornades, pot nomenar bibliotecaris i/o coordinadors de taula responsables de les claus del local i vetlla per la igualtat entre activitats.',
          '5.1–5.4. Els socis poden proposar nous Grups de Treball mitjançant fitxa de motivació, objectius i pla de treball per a la seva aprovació per la Junta Directiva.',
        ],
      },
      {
        heading: '6. Els socis: procés d’admissió, drets i deures',
        paragraphs: [
          '6.1.1–6.1.6. Les persones interessades reben explicació dels objectius i del RRI i omplen la sol·licitud d’inscripció. Els menors de 14 anys s’associen mitjançant quota familiar; entre 14 i 17 anys poden fer-ho per quota familiar o com a socis juvenils amb autorització signada. Un aspirant pot estar exempt de pagar durant 3 mesos de prova; si decideix incorporar-se, abona la part proporcional des del primer dia d’accés.',
          '6.2.1–6.2.2. La baixa voluntària es comunica per escrit o per correu electrònic a la Junta Directiva.',
          '6.3.1–6.3.6. Cada taula té l’obligació de netejar i recollir el local. Els socis anoten l’ús dels jocs de la ludoteca al Full de Registre; no està permès el préstec fora del local. El material personal guardat al local no es pot utilitzar sense permís del propietari.',
        ],
      },
      {
        heading: '7. Quotes',
        paragraphs: [
          '7.1–7.2. Quota anual (any natural) per avançat: Quota individual de 50 €; Quota familiar de 70 € (fins a dues persones majors d’edat i els seus fills menors d’edat).',
          '7.3–7.5. Les noves altes paguen la part proporcional dels mesos restants de l’any natural. Qui gaudeix dels 3 mesos de prova i s’incorpora abona la part corresponent des del primer dia d’accés. El pas d’individual a familiar abona només la diferència proporcional.',
          '7.6–7.7. En casos justificats la Junta Directiva pot valorar exempcions excepcionals de pagament; l’impagament sense explicacions constitueix falta greu.',
        ],
      },
      {
        heading: '8. Comportament i ús del local',
        paragraphs: [
          '8.1.1–8.1.5. El local es destina a jocs de taula, jocs de rol, xerrades i activitats afins. Es pot convidar persones externes avisant prèviament la Junta Directiva (menors de 14 anys sempre acompanyats de pares o tutors), assumint el soci amfitrió la responsabilitat sobre els convidats. No es pot accedir a espais no cedits a l’associació.',
          '8.2.1–8.2.4. Tipus de faltes: lleus (amonestació), greus (suspensió fins a 6 mesos) i molt greus (possible expulsió ratificada en Assemblea Extraordinària). La reiteració eleva la categoria en un grau.',
          '8.2.5. Faltes lleus: no netejar el local, no omplir el Full de Registre de ludoteca, retard en el pagament equivalent al període de prova, o convidar persones alienes sense coneixement de la Junta.',
          '8.2.6. Faltes greus: agafar material sense permís, impagament de quota, malmetre material intencionadament o sense comunicar-ho, fomentar conflictes, no respectar instal·lacions d’altres entitats, consumir tabac o alcohol al local o qualsevol falta de respecte o insult.',
          '8.2.7. Faltes molt greus: impagament reiterat, no retornar material, ús no autoritzat del local, danys per mal ús, fer còpies de claus sense autorització, consumir substàncies il·legals o exercir violència verbal, física o psicològica.',
        ],
      },
      {
        heading: '9. Modificació del Reglament de Règim Intern',
        paragraphs: [
          '9.1–9.3. Qualsevol soci pot proposar modificacions del RRI amb l’aval del 10 % de l’associació; la Junta Directiva les inclourà a l’ordre del dia de la següent Assemblea i s’aprovaran amb el suport de 2/3 dels vots.',
        ],
      },
    ],
  },
};

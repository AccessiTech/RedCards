/**
 * @fileoverview Resources Content (DEPRECATED)
 * 
 * ⚠️ DEPRECATED: This file is kept for reference only.
 * All resource data has been migrated to src/config/resources.json.
 * 
 * DO NOT import from this file. Use the config module instead:
 * 
 * @example Import resources
 * import { resources, getDigitalResources, getPrintableResources } from '../../config';
 * 
 * @example Access specific resources
 * import { getRedCardsPrintLinks } from '../../config';
 * const pdfLinks = getRedCardsPrintLinks();
 * 
 * @deprecated since Phase 3.4 PR2
 * @see {@link ../../config/resources.json} for resource data
 * @see {@link ../../config/index.js} for helper functions
 */

// NOTE: Resource data has been moved to src/config/resources.json
// This file is kept for reference but is no longer imported by components.
// Import from '../../config' to access resources data:
//   import { getDigitalResources, getPrintableResources, getRedCardsPrintLinks } from '../../config';

export const digitalResources = {
  "informedimmigrant.com": {
    title: "Learn about YOUR RIGHTS (Federal)",
    description:
      "Informed Immigrant is a resource that provides information on your rights as an immigrant in the United States, regardless of your status.",
    source:
      "https://www.informedimmigrant.com/resources/detention-deportation/know-your-rights/",
  },
  "caimmigrant.org": {
    title: "California Immigration Legal Protections",
    // description: "Provided by " ,
    source:
      "https://caimmigrant.org/what-we-do/policy/fighting-mass-detention-deportation/resources-for-immigration-legal-protection/",
    links: [
      {
        title: "California Rapid Response Networks",
        url: "https://caimmigrant.org/what-we-do/policy/fighting-mass-detention-deportation/resources-for-immigration-legal-protection/#:~:text=California%20Rapid%20Response%20Networks",
        description: "Find your local rapid response network.",
      },
      {
        title: "Know Your Rights Resources",
        url: "https://caimmigrant.org/what-we-do/policy/fighting-mass-detention-deportation/resources-for-immigration-legal-protection/#:~:text=Know%20Your%20Rights",
        description: "Learn about your rights.",
      },
    ],
  },
};

export const redCardsPrintLinks = {
  arabic:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-arabic.pdf",
  chinese:
    "https://www.ilrc.org/sites/default/files/resources/red_card-self_srv-chinese.pdf",
  english:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-english.pdf",
  farsi:
    "https://www.ilrc.org/sites/default/files/2024-12/Artwork%20for%20Printing%20Your%20Own%20Red%20Cards%20-%20Farsi.pdf",
  french:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-french-20190603.pdf",
  haitian_creole:
    "https://www.ilrc.org/sites/default/files/2023-06/Artwork%20for%20Printing%20Your%20Own%20Red%20Cards%20-%20Haitian%20Creole.pdf",
  hmong:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-hmong-20190917.pdf",
  korean:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-korean.pdf",
  pashto:
    "https://www.ilrc.org/sites/default/files/2024-12/Artwork%20for%20Printing%20Your%20Own%20Red%20Cards%20-%20Pashto.pdf",
  punjabi:
    "https://www.ilrc.org/sites/default/files/documents/artwork_for_printing_your_own_red_cards_-_punjabi.pdf",
  russian:
    "https://www.ilrc.org/sites/default/files/documents/artwork_for_printing_your_own_red_cards_-_russian.pdf",
  spanish:
    "https://www.ilrc.org/sites/default/files/2025-01/Artwork%20for%20Printing%20Your%20Own%20Red%20Cards%20-%20Spanish.pdf",
  tagalog:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-tagalog-20190603.pdf",
  tigrinya:
    "https://www.ilrc.org/sites/default/files/2024-12/Artwork%20for%20Printing%20Your%20Own%20Red%20Cards%20-%20Tigrinya.pdf",
  ukrainian:
    "https://www.ilrc.org/sites/default/files/documents/artwork_for_printing_your_own_red_cards_-_ukrainian.pdf",
  vietnamese:
    "https://www.ilrc.org/sites/default/files/documents/red_card-self_srv-vietnamese-20190603.pdf",
};

export const printableResources = {
  "Red Cards (Original)": {
    title: "Red Cards",
    description:
      "Red Cards are a resource that can be used to assert your rights when interacting with law enforcement. They are available in multiple languages.",
    source: "https://www.ilrc.org/red-cards",
    links: Object.keys(redCardsPrintLinks).map((language) => ({
      title: language,
      url: redCardsPrintLinks[language],
    })),
  },
  "Printable Flyers": {
    title: "Flyers",
    description: "Printable flyers for distribution.",
    source: "htts://redcards.accessi.tech/",
    links: [
      {
        title: "Black and White",
        url: "/assets/Flyer.pdf",
      },
      {
        title: "Blank",
        url: "/assets/Flyer_blank.pdf",
      }
    ],
  },
  "Printable QR Code": {
    title: "QR Code",
    description:
      "A QR code that links to this. Print and distribute to help spread the word.",
    source: "https://redcards.accessi.tech/",
    links: [
      {
        title: "Black",
        url: "/assets/qr_black.svg",
      },
      {
        title: "White",
        url: "/assets/qr.svg",
      },
      {
        title: "Red",
        url: "/assets/qr_red.svg",
      }
    ],
  },
};

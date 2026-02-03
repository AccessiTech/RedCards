/**
 * @fileoverview Rights Section Content (JSX Components)
 * 
 * This file contains the static JSX content for the Rights section.
 * These are React components and remain in this file as JSX cannot be stored in JSON.
 * 
 * NOTE: Rapid Response Network data has been migrated to src/config/regions.json.
 * 
 * @note The network data from this file has been moved. Import from config instead:
 * @example
 * import { regions, getSacramentoPhoneNumber } from '../../config';
 * 
 * @see {@link ../../config/regions.json} for network data
 * @see {@link ../../config/index.js} for helper functions
 */

// content for the right side of the Rights section
export const rightHeader = "To the agent";
export const rightColContent = (
  <>
    <p>
      I do not wish to speak with you, answer your questions, or sign or hand
      you any documents based on my 5th Amendment rights under the United States
      Constitution.
    </p>
    <p>
      I do not give you permission to enter my home based on my 4th Amendment
      rights under the United States Constitution unless you have a warrant to
      enter, signed by a judge or magistrate with my name on it that you slide
      under the door.
    </p>
    <p>
      I do not give you permission to search any of my belongings based on my
      4th Amendment rights.
    </p>
    <p>I choose to exercise my constitutional rights.</p>
  </>
);

// content for the left side of the Rights section
export const leftHeader = "You have constitutional rights";
export const leftColContent = (
  <>
    <p>
      <b>DO NOT OPEN THE DOOR</b> if an immigration agent is knocking on the
      door.
    </p>
    <p>
      <b>DO NOT ANSWER ANY QUESTIONS</b> from an immigration agent if they try
      to talk to you. You have the right to remain silent.
    </p>
    <p>
      <b>DO NOT SIGN ANYTHING</b> without first speaking to a lawyer. You have
      the right to speak with a lawyer.
    </p>
    <p>
      If you are outside of your home, ask the agent if you are free to leave
      and if they say yes, leave calmly.
    </p>
    <p>
      <b>GIVE THIS CARD TO THE AGENT.</b> If you are inside of your home, show
      the card through the window or slide it under the door.
    </p>
  </>
);

// Content credit paragraph for the Rights section
export const attribution = (
  <p className="credit">
    {`This is a digital version of the "Red Cards" created by `}
    <a
      href="https://www.ilrc.org/red-cards"
      target="_blank"
      rel="noopener noreferrer"
    >
      {`the Immigration Legal Resource Center`}
    </a>
    {`.`}
  </p>
);

/**
 * NOTE: Rapid Response Network Configuration
 * ==========================================
 * 
 * Network data (phone numbers, regions, coverage areas) has been moved to:
 * - Data: src/config/regions.json
 * - Helpers: src/config/index.js
 * 
 * This file now only contains JSX content that cannot be stored in JSON.
 * 
 * Migration completed in Phase 3.4 PR1.
 * 
 * @example Import networks data
 * import { regions, getSacramentoPhoneNumber } from '../../config';
 * 
 * @example Access specific network
 * import { getNetworkById } from '../../config';
 * const sacramento = getNetworkById('sacramento');
 * console.log(sacramento.phoneNumber);
 */

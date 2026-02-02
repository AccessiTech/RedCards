
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

// NOTE: Rapid Response Network data has been moved to src/config/regions.json
// Import from '../../config' to access regions data:
//   import { regions, getSacramentoPhoneNumber } from '../../config';

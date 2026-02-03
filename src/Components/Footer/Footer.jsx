import { urls, app } from '../../config';

function Footer() {
  return (
    <footer>
      <p className="credit">
        This site uses Google Analytics and Google Translate, and does not store
        any data.
      </p>
      <p className="credit">
        Click here to report an{" "}
        <a
          href={urls.external.github.issues}
          target="_blank"
          rel="noopener noreferrer"
        >
          Issue / Request
        </a>
        , join the{" "}
        <a
          href={urls.external.github.discussion}
          target="_blank"
          rel="noopener noreferrer"
        >
          Discussion
        </a>
        , or view the site's{" "}
        <a
          href={urls.external.github.repo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Repository
        </a>
        .
      </p>
      <p className="credit">
        &copy; {new Date().getFullYear()} {app.copyright}
      </p>
    </footer>
  );
}

export default Footer;

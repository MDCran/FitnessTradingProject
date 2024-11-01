import Link from "src/components/Link";

const Footer = () => (
  <footer className="pv5 ph2 flex items-center justify-center w-100 bt b--moon-gray">
    <p className="fw5 f5 tc">
      Cloned from{" "}
      <Link
        to="https://github.com/adamjanicki2/vercel-mern-skeleton"
        target="_blank"
        rel="noreferrer"
      >
        Vercel MERN Skeleton
      </Link>
      , built by Adam
    </p>
  </footer>
);

export default Footer;

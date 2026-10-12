export const Logo = ({ light = false, className = "h-9 w-auto" }) => (
  <img
    src={light ? "/img/grindtek-logo-light.png" : "/img/grindtek-logo.png"}
    alt="GrindTek by Overkkast"
    className={className}
    data-testid="brand-logo"
  />
);

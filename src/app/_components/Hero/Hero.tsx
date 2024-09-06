import classNames from "classnames/bind";
import styles from "./Hero.module.scss";

const cn = classNames.bind(styles);

export type HeroTypes = {
  children?: React.ReactNode;
  noMinHeight?: boolean;
};

const Hero = ({ children, noMinHeight }: HeroTypes) => {
  return (
    <div
      className={cn("landing", "grey-background")}
      style={{ minHeight: noMinHeight ? "unset" : "500px" }}
    >
      {children}
    </div>
  );
};

export default Hero;

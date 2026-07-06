import MoonIcon from "../components/icons/MoonIcon.astro";
import SparkleIcon from "../components/icons/SparkleIcon.astro";
import FlowerIcon from "../components/icons/FlowerIcon.astro";
import StarIcon from "../components/icons/StarIcon.astro";
import HouseIcon from "../components/icons/HouseIcon.astro";
import PawIcon from "../components/icons/PawIcon.astro";

export interface Offering {
  icon: typeof MoonIcon;
  title: string;
  copy: string;
}

export const offerings: Offering[] = [
  { icon: MoonIcon, title: "Life Assessment Sessions", copy: "A clairvoyant reading of where you stand — illuminating patterns, blocks, and the many paths open before you." },
  { icon: SparkleIcon, title: "Trance Sessions with Dr. Peebles", copy: "Speak directly with the spirit of Dr. James Martin Peebles as he answers through Kim in deep trance. Private & group sessions." },
  { icon: FlowerIcon, title: "Spiritual Counseling", copy: "Compassionate one-on-one guidance to move through grief, transition, and awakening with clarity and grace." },
  { icon: StarIcon, title: "Career & Business Counseling", copy: "Intuitive insight for decisions, direction, and alignment — bringing your work into harmony with your purpose." },
  { icon: HouseIcon, title: "House & Property Blessing", copy: "Energy cleansing and blessing for homes and spaces — clearing what lingers, inviting in light and peace." },
  { icon: PawIcon, title: "Animal Communication", copy: "The animal kingdom speaks. Kim listens — connecting you with the thoughts and feelings of your beloved companions." },
];

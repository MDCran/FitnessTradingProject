import {
  Link as UILink,
  UnstyledLink as UIUnstyledLink,
} from "@adamjanicki/ui";
import { Link as RouterLink } from "react-router-dom";

type Props = React.ComponentProps<typeof UILink>;

const Link = (props: Props) => <UILink LinkElement={RouterLink} {...props} />;

export const UnstyledLink = (
  props: React.ComponentProps<typeof UIUnstyledLink>
) => <UIUnstyledLink LinkElement={RouterLink} {...props} />;

export default Link;

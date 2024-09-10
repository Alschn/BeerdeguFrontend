import { type ComponentPropsWithoutRef, forwardRef } from "react";
import BeerRowItem from "./BeerRowItem";

interface BeerSelectItemProps extends ComponentPropsWithoutRef<"div"> {
  image: string | null;
  label: string;
  description: string;
  badge: string;
}

const BeerSelectItem = forwardRef<HTMLDivElement, BeerSelectItemProps>(
  ({ image, label, description, badge, ...rest }: BeerSelectItemProps, ref) => (
    <div ref={ref} {...rest}>
      <BeerRowItem
        image={image}
        label={label}
        description={description}
        badge={badge}
      />
    </div>
  )
);
BeerSelectItem.displayName = "BeerSelectItem";

export default BeerSelectItem;

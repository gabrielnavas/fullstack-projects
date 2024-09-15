import { FC } from "react";

import { Button } from "../ui/button";
import Link from "next/link";
import { menuPaths } from "./menu-paths";
import { MenuFullPageContainer } from "./menu-full-page-container";


export const MenuDesktop: FC = () => {
  return (
    <MenuFullPageContainer>
      {
        menuPaths.map(path => (
          <Link href={path.path} key={path.title}>
            <Button
              variant='link'
              className="border w-[100%] mb-1">
              {path.title}
            </Button>
          </Link>
        ))
      }
    </MenuFullPageContainer>
  );
}

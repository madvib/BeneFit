import { Menu } from 'lucide-react';

export function MobileMenuToggle({
  openMenu: openMenu,
}: {
  openMenu: () => void;
}) {
  return (
    <button
      onClick={openMenu}
      className="text-muted-foreground hover:text-foreground hover:bg-accent -mr-2 rounded-md p-2 transition-colors md:hidden"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}

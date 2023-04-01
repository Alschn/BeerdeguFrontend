'use client';

import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

function ColorModeToggle() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const iconProps = {
    size: 20,
    strokeWidth: 1.5,
  };

  return (
    <Group position="center" mt="xl">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="xl"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ?
            theme.colors.dark[6] :
            theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? (
          <IconSun {...iconProps}/>
        ) : (
          <IconMoonStars {...iconProps}/>
        )}
      </ActionIcon>
    </Group>
  );
}

export default ColorModeToggle;

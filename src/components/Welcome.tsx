'use client';

import { Title, Text, Anchor, createStyles, Code, Box } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontSize: 100,
    fontWeight: 900,
    letterSpacing: -2,
    [theme.fn.smallerThan('md')]: {
      fontSize: 50,
    },
  },
}));

function Welcome() {
  const { classes } = useStyles();

  return (
    <Box mt={100}>
      <Title className={classes.title} align="center">
        Welcome to{' '}
        <Text inherit variant="gradient" gradient={{ from: 'orange', to: 'yellow', deg: 45 }} component="span">
          Beerdegu
        </Text>
      </Title>
      <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
        This starter Next.js project includes a minimal setup for server side rendering, if you want
        to learn more on Mantine + Next.js integration follow{' '}
        <Anchor href="https://mantine.dev/guides/next/" size="lg">
          this guide
        </Anchor>
        . To get started edit <Code>Welcome.tsx</Code> file.
      </Text>
    </Box>
  );
}

export default Welcome;

<script>
  import marked from 'marked';
  import { MultiSelect, Button, InlineLoading, Tile } from 'carbon-components-svelte';
  import ChevronRight24 from 'carbon-icons-svelte/lib/ChevronRight24';
  import Reset24 from 'carbon-icons-svelte/lib/Reset24';
  import DirectionStraightRight24 from 'carbon-icons-svelte/lib/DirectionStraightRight24';

  const categories = [
    { text: 'Discord 🔵', id: 'discord' },
    { text: 'Embarassing 😳', id: 'embarassing' },
    { text: 'Food 🍲', id: 'food' },
    { text: 'Funny 😂', id: 'funny' },
    { text: 'Games 🎮', id: 'games' },
    { text: 'Gross 🤢', id: 'gross' },
    { text: 'Random 🎲', id: 'random' },
    { text: 'Rules 📄', id: 'rules' },
    { text: 'Couples 👫🔞', id: 'nsfw/couples' },
    { text: 'Dirty 💦🔞', id: 'nsfw/dirty' },
    { text: 'Girls 👩🔞', id: 'nsfw/girls' },
    { text: 'Guys 👨🔞', id: 'nsfw/guys' }
  ];

  function popRandomElement(array) {
    const index = Math.floor(Math.random() * array.length);
    return [array[index], array.filter((value) => value !== array[index])];
  }

  // States

  let selectedCategoryIds = [];
  let gameLoading = false;
  let selectedStatement = null;
  let statements = [];
  let gameStarted = false;

  // Callbacks

  async function startGame() {
    gameLoading = true;

    const responseTexts = await Promise.all(
      selectedCategoryIds.map((id) => fetch(`data/${id}.txt`).then((response) => response.text()))
    );

    const newStatements = responseTexts
      .map((responseText) => responseText.split('\n'))
      .reduce((a, b) => [...a, ...b], []);

    [selectedStatement, statements] = popRandomElement(newStatements);
    gameStarted = true;
    gameLoading = false;
  }

  function selectNextStatement() {
    [selectedStatement, statements] = popRandomElement(statements);
  }

  function resetGame() {
    gameStarted = false;
    gameLoading = false;
    selectedStatement = null;
    statements = [];
  }
</script>

<svelte:head>
  <title>Never Have I Ever</title>
</svelte:head>

{#if !gameStarted}
  <div class="min-h-screen p-8 min-w-screen">
    <Tile class="flex flex-col max-w-xl w-full mx-auto space-y-8">
      <h1 class="mt-6 text-5xl">Never Have I Ever</h1>
      <div class="w-full space-y-2">
        <h3 class="text-xl">Select Categories</h3>
        <MultiSelect
          bind:selectedIds={selectedCategoryIds}
          class="w-full"
          items={categories}
          label="Categories"
          sortItem={() => {}}
        />
        <Button
          class="w-full !max-w-full"
          icon={DirectionStraightRight24}
          disabled={selectedCategoryIds.length === 0 || gameLoading}
          on:click={startGame}
        >
          {#if gameLoading}
            <InlineLoading description="Loading game..." />
          {:else}
            Let's Play
          {/if}
        </Button>
      </div>
    </Tile>
  </div>
{:else}
  <div class="flex flex-col min-h-screen p-8 min-w-screen">
    <Tile class="!flex flex-col flex-1 max-w-xl w-full mx-auto space-y-4">
      <h1 class="mt-6 text-5xl">Never Have I Ever</h1>
      <Tile light class="!flex !items-center !flex-grow">
        <p class="text-3xl text-center">
          {@html marked.parseInline(selectedStatement)}
        </p>
      </Tile>
      <p class="text-gray-500 text-xs text-right">{statements.length} left</p>
      <div class="flex flex-row space-x-2">
        <Button kind="secondary" class="flex-1 !max-w-full" icon={Reset24} on:click={resetGame}
          >Reset</Button
        >
        {#if statements.length > 0}
          <Button class="flex-1" icon={ChevronRight24} on:click={selectNextStatement}>Next</Button>
        {/if}
      </div>
    </Tile>
  </div>
{/if}

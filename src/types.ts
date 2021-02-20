type TileSpec = {
  name: string;
  type?: 'ground';
  pattern?: boolean;
  ranges: [
    | [number, number, number, number]
    | [number, number, number]
    | [number, number]
  ];
};

type Pattern = {
  tiles: TileSpec[];
};

type Patterns = Record<string, Pattern>;

type EntitySpec = {
  name: string;
  position: [number, number];
};

type LevelSpec = {
  spriteSheet: string;
  musicSheet: string;
  patternSheet: string;
  layers: {
    tiles: TileSpec[];
  }[];
  entities: EntitySpec[];
};

type SpriteSheetTile = {
  name: string;
  index: [number, number];
};

type CharacterSpec = {
  name: string;
  rect: [number, number, number, number];
};

type SpriteSheetSpec = {
  imageURL: string;
  // @TODO: tileW and tileH should be optional,
  // in SpriteSheet class there should be a customizable global defaultTileSize,
  // which has no effect on spritesheets that don't have tiles
  tileW: number;
  tileH: number;
  tiles?: SpriteSheetTile[];
  frames?: CharacterSpec[];
  animations?: [
    {
      name: string;
      frameLen: number;
      frames: string[];
    }
  ];
};

type AudioSheetSpec = {
  fx: Record<string, Record<'url', string>>;
};

type MusicSheetSpec = {
  main: Record<'url', string>;
};

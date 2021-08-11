
export enum Ground {
  TURF = 1,
  DART = 2,
}

export enum Track {
  MIDDLE = 1,
  IN = 2,
  OUT = 3,
}

export enum TargetStatus {
  SPEED = 1,
  STAMINA = 2,
  POWER = 3,
  GUTS = 4,
  WISDOM = 5,
}

export enum Permission {
  JUNIOR = 1,
  CLASSIC = 2,
  SENIOR_OR_CLASSIC = 3,
  SENIOR = 4,
  URA = 5,
}

export enum Grade {
  DEBUT = 900,
  NOT_WINNING = 800,
  PRE_OP = 700,
  OP = 400,
  G3 = 300,
  G2 = 200,
  G1 = 100,
}

export enum Turn {
  RIGHT = 1,
  LEFT = 2,
  NONE = 4,
}

export interface SingleModeRaceData {
  characters: string[];
  distance: number;
  entryCount: number;
  fanCounts: number[];
  grade: Grade;
  ground: Ground;
  half: number;
  minFanCount: number;
  month: number;
  name: string;
  permission: Permission;
  stadium: string;
  targetStatus: TargetStatus[];
  track: Track;
  turn: Turn;
}

export default class SingleModeRace {
  characters: string[];

  distance: number;

  entryCount: number;

  fanCounts: number[];

  grade: Grade;

  ground: Ground;

  half: number;

  minFanCount: number;

  month: number;

  name: string;

  permission: Permission;

  stadium: string;

  targetStatus: TargetStatus[];

  track: Track;

  turn: Turn;

  constructor(data: SingleModeRaceData) {
    this.characters = data.characters;
    this.distance = data.distance;
    this.entryCount = data.entryCount;
    this.fanCounts = data.fanCounts;
    this.grade = data.grade;
    this.ground = data.ground;
    this.half = data.half;
    this.minFanCount = data.minFanCount;
    this.month = data.month;
    this.name = data.name;
    this.permission = data.permission;
    this.stadium = data.stadium;
    this.targetStatus = data.targetStatus;
    this.track = data.track;
    this.turn = data.turn;
  }

  years(): number[] {
    switch (this.permission) {
      case Permission.JUNIOR:
        return [1];
      case Permission.CLASSIC:
        return [2];
      case Permission.SENIOR_OR_CLASSIC:
        return [2, 3];
      case Permission.SENIOR:
        return [3];
      case Permission.URA:
        return [4];
      default:
        throw Error(`Race.years: unknown permission: ${this.permission}`);
    }
  }

  turnCounts(): number[] {
    return this.years().map(
      (i) => (i - 1) * 24 + (this.month - 1) * 2 + this.half - 1
    );
  }

  groundText(): string {
    return Ground[this.ground];
  }

  isTargetRace(): boolean | undefined {
    if (this.grade >= Grade.DEBUT) {
      return true;
    }
    if (this.permission >= Permission.URA) {
      return true;
    }
    return undefined;
  }
}

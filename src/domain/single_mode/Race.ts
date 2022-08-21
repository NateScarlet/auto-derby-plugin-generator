import Grade from '@/domain/single_mode/Grade';
import Ground from '@/domain/single_mode/Ground';
import Permission from '@/domain/single_mode/Permission';
import type TargetStatus from '@/domain/single_mode/TargetStatus';
import type Track from '@/domain/single_mode/Track';
import type Turn from '@/domain/single_mode/Turn';

export interface RaceInput {
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

export default class Race {
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

  constructor(input: RaceInput) {
    this.characters = input.characters;
    this.distance = input.distance;
    this.entryCount = input.entryCount;
    this.fanCounts = input.fanCounts;
    this.grade = input.grade;
    this.ground = input.ground;
    this.half = input.half;
    this.minFanCount = input.minFanCount;
    this.month = input.month;
    this.name = input.name;
    this.permission = input.permission;
    this.stadium = input.stadium;
    this.targetStatus = input.targetStatus;
    this.track = input.track;
    this.turn = input.turn;
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

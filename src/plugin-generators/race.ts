import { sortBy } from 'lodash-es';

export type Action = 'ban' | 'less' | 'none' | 'more' | 'pick';

export interface RaceAction {
  turn: number;
  name: string;
  action: Action;
}

export interface Input {
  raceActions: RaceAction[];
  defaultAction: Action;
}

export default function generateRacePlugin(input: Input): string {
  return `\
# -*- coding=UTF-8 -*-
# Code generated by auto-derby-plugin-generator ${__VERSION__}
# URL: ${window.location.href}
# Date: ${new Date().toISOString()}

import auto_derby
from auto_derby import single_mode


from typing import Text, Dict, Tuple

_ACTION_NONE = 0
_ACTION_BAN = 1
_ACTION_LESS = 2
_ACTION_MORE = 3
_ACTION_PICK = 4

_DEFAULT_ACTION = _ACTION_${input.defaultAction.toUpperCase()}

_RULES: Dict[Tuple[int, Text], int] = {
${sortBy(
  input.raceActions,
  (i) => i.turn,
  (i) => i.name
)
  .map(
    (i) => `    (${i.turn}, "${i.name}"): _ACTION_${i.action.toUpperCase()},`
  )
  .join('\n')}
}


class Plugin(auto_derby.Plugin):
    def install(self) -> None:
        class Race(auto_derby.config.single_mode_race_class):
            def score(self, ctx: single_mode.Context) -> float:
                ret = super().score(ctx)
                action = _RULES.get(
                    (ctx.turn_count(), self.name),
                    _DEFAULT_ACTION,
                )
                if action == _ACTION_BAN:
                    ret = 0
                elif action == _ACTION_LESS:
                    ret -= 5
                elif action == _ACTION_MORE:
                    ret += 5
                elif action == _ACTION_PICK:
                    ret += 100
                return ret

        auto_derby.config.single_mode_race_class = Race


auto_derby.plugin.register(__name__, Plugin())
`;
}

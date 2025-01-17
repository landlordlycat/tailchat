import { UserListItem } from '@/components/UserListItem';
import { getMessageTextDecorators } from '@/plugin/common';
import { stopPropagation } from '@/utils/dom-helper';
import React from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { t } from 'tailchat-shared';
import { useChatInputMentionsContext } from './context';
import { MentionCommandItem } from './MentionCommandItem';
import './input.less';

interface ChatInputBoxInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    'value' | 'onChange'
  > {
  inputRef?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (message: string, mentions: string[]) => void;
}
export const ChatInputBoxInput: React.FC<ChatInputBoxInputProps> = React.memo(
  (props) => {
    const { users, panels, placeholder, disabled } =
      useChatInputMentionsContext();

    return (
      <MentionsInput
        inputRef={props.inputRef}
        className="chatbox-mention-input"
        placeholder={placeholder ?? t('输入一些什么')}
        disabled={disabled}
        singleLine={true}
        maxLength={1000}
        value={props.value}
        onChange={(e, newValue, _, mentions) =>
          props.onChange(
            newValue,
            mentions.map((m) => m.id)
          )
        }
        onKeyDown={props.onKeyDown}
        onPaste={props.onPaste}
        onContextMenu={stopPropagation}
        allowSuggestionsAboveCursor={true}
        forceSuggestionsAboveCursor={true}
      >
        <Mention
          trigger="@"
          data={users}
          displayTransform={(id, display) => `@${display}`}
          appendSpaceOnAdd={true}
          renderSuggestion={(suggestion) => (
            <UserListItem userId={String(suggestion.id)} />
          )}
          markup={getMessageTextDecorators().mention('__id__', '__display__')}
        />
        <Mention
          trigger="#"
          data={panels}
          displayTransform={(id, display) => `#${display}`}
          appendSpaceOnAdd={true}
          renderSuggestion={(suggestion) => (
            <MentionCommandItem
              icon="mdi:pound"
              label={suggestion.display ?? String(suggestion.id)}
            />
          )}
          markup={getMessageTextDecorators().url('__id__', '#__display__')}
        />
      </MentionsInput>
    );
  }
);
ChatInputBoxInput.displayName = 'ChatInputBoxInput';

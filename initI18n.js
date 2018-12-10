import i18next from 'i18next';
import LocizeBackend from 'i18next-locize-backend';
import { Localization } from 'expo-localization';
import _ from 'lodash';
import subtag from 'subtag';

export default (callback) => i18next
  .use({
    type: 'languageDetector',
    async: false,
    detect: (callback: string => void) =>
      // 端末から取得出来るlocale情報とlocizeの言語タグに違いがあるのでそのギャップを埋める
      Localization.getLocalizationAsync().then(({ locale }) => {
        const { language, script } = subtag(locale);
        callback(_.concat([language, script]).filter(Boolean).join('-'));
      }),
    init: () => {},
    cacheUserLanguage: () => {},
  })
  .use(LocizeBackend)
  .init({
    lng: 'ja',
    debug: true,
    fallbackLng: {
      // lngに指定した言語が翻訳されていない場合に参照する言語
      default: ['en']
    },
    // locizeに登録されているnamespace。demoの場合はtranslation
    defaultNS: 'translation',
    backend: {
      // locizeのプロジェクトIDです
      projectId: 'projectId',
      // saveMissingがtrueの時に必要です。
      apiKey: 'apiKey',
      // locizeで設定されているreferenceLngを指定してください。saveMissingがtrueのときに必要です。
      referenceLng: 'en',
      // locizeのどのバージョンの言語を取得するのかを指定します。デフォルトはlatestです
      version: 'latest',
    },
  }, callback)

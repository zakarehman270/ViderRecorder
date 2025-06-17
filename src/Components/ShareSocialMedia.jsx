import { useState } from 'react';
import { 
  X, 
  Facebook, 
  Twitter, 
  MessageSquare, 
  Send, 
  Linkedin, 
  Clipboard, 
  Check 
} from 'lucide-react';
import PropTypes from 'prop-types';

const SocialShare = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Share Modal</h2>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-gray-600">Share this link via</p>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Share on Facebook"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600"
            aria-label="Share on Twitter"
          >
            <Twitter size={20} />
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
            aria-label="Share on WhatsApp"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={() => handleShare('telegram')}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            aria-label="Share on Telegram"
          >
            <Send size={20} />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={20} />
          </button>
        </div>

        <p className="mb-2 text-gray-600">Or copy link</p>
        <div className="flex items-center border rounded-lg p-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 outline-none bg-transparent text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700"
          >
            {copied ? (
              <>
                <Check size={16} className="inline mr-1" /> Copied
              </>
            ) : (
              <>
                <Clipboard size={16} className="inline mr-1" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
SocialShare.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default SocialShare;
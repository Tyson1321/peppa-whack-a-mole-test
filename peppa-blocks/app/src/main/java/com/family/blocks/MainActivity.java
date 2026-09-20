package com.family.blocks;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.*;
import android.speech.tts.TextToSpeech;
import android.view.View;
import java.util.Locale;
public class MainActivity extends Activity {
 private WebView web; private TextToSpeech tts; private boolean ready=false; private String pending=null;
 @Override public void onCreate(Bundle state){super.onCreate(state);getWindow().setStatusBarColor(0xffFFF8E9);getWindow().setNavigationBarColor(0xffFFF8E9);web=new WebView(this);setContentView(web);web.getSettings().setJavaScriptEnabled(true);web.getSettings().setDomStorageEnabled(true);web.getSettings().setMediaPlaybackRequiresUserGesture(false);web.getSettings().setAllowFileAccess(false);web.getSettings().setAllowContentAccess(false);
 web.addJavascriptInterface(new Object(){@JavascriptInterface public void speak(String text){runOnUiThread(()->{if(ready)tts.speak(text,TextToSpeech.QUEUE_FLUSH,null,"story");else pending=text;});}@JavascriptInterface public void stopSpeaking(){runOnUiThread(()->{pending=null;if(tts!=null)tts.stop();});}},"Android");
 web.setWebViewClient(new WebViewClient(){@Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){String url=request.getUrl().toString();String prefix="https://game.local/";if(url.startsWith(prefix)){String path=url.substring(prefix.length()).split("\\?")[0];if(path.isEmpty())path="index.html";if(path.contains(".."))return new WebResourceResponse("text/plain","UTF-8",null);String mime=path.endsWith(".js")?"application/javascript":path.endsWith(".css")?"text/css":path.endsWith(".jpg")?"image/jpeg":"text/html";try{return new WebResourceResponse(mime,"UTF-8",getAssets().open(path));}catch(Exception e){return new WebResourceResponse("text/plain","UTF-8",null);}}return new WebResourceResponse("text/plain","UTF-8",null);}@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return true;}});
 tts=new TextToSpeech(this,status->{if(status==TextToSpeech.SUCCESS){int result=tts.setLanguage(Locale.SIMPLIFIED_CHINESE);ready=result>=TextToSpeech.LANG_AVAILABLE;tts.setSpeechRate(.85f);if(ready&&pending!=null){tts.speak(pending,TextToSpeech.QUEUE_FLUSH,null,"story");pending=null;}}});web.loadUrl("https://game.local/index.html");}
 @Override protected void onPause(){super.onPause();if(tts!=null)tts.stop();web.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override public void onBackPressed(){web.evaluateJavascript("menu()",null);}
 @Override protected void onDestroy(){if(tts!=null)tts.shutdown();if(web!=null){web.removeJavascriptInterface("Android");web.destroy();}super.onDestroy();}
}

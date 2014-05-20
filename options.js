function save_options() {
  var tags = document.getElementById('tags').value;
  chrome.storage.sync.set({
    bountyTags: tags
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    bountyTags: ''
  }, function(items) {
    document.getElementById('tags').value = items.bountyTags;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);